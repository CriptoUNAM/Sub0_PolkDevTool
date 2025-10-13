export function formatRustCode(code: string): string {
  // Basic Rust code formatting
  let formatted = code
    .replace(/\s*{\s*/g, ' {\n    ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\s*;\s*/g, ';\n')
    .replace(/\s*,\s*/g, ',\n    ')
    .replace(/\n\s*\n\s*\n/g, '\n\n');

  // Fix indentation
  const lines = formatted.split('\n');
  let indentLevel = 0;
  const indentSize = 4;

  const formattedLines = lines.map(line => {
    const trimmed = line.trim();
    
    if (trimmed === '') return '';
    
    // Decrease indent for closing braces
    if (trimmed === '}' || trimmed.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    const indented = ' '.repeat(indentLevel * indentSize) + trimmed;
    
    // Increase indent for opening braces
    if (trimmed.endsWith('{')) {
      indentLevel++;
    }
    
    return indented;
  });

  return formattedLines.join('\n');
}

export function validateRustSyntax(code: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic syntax checks
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    errors.push('Mismatched braces: { and }');
  }
  
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  
  if (openParens !== closeParens) {
    errors.push('Mismatched parentheses: ( and )');
  }
  
  // Check for required ink! attributes
  if (!code.includes('#[ink::contract]')) {
    errors.push('Missing #[ink::contract] attribute');
  }
  
  if (!code.includes('#[ink(storage)]')) {
    errors.push('Missing #[ink(storage)] struct');
  }
  
  if (!code.includes('#[ink(constructor)]')) {
    errors.push('Missing #[ink(constructor)] function');
  }
  
  if (!code.includes('#[ink(message)]')) {
    errors.push('Missing #[ink(message)] functions');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function extractContractInfo(code: string): {
  contractName: string;
  functions: string[];
  events: string[];
  errors: string[];
} {
  const contractNameMatch = code.match(/mod\s+(\w+)/);
  const contractName = contractNameMatch ? contractNameMatch[1] : 'Unknown';
  
  const functionMatches = code.match(/#\[ink\(message\)\]\s*pub\s*fn\s+(\w+)/g);
  const functions = functionMatches ? functionMatches.map(f => f.replace(/#\[ink\(message\)\]\s*pub\s*fn\s+/, '')) : [];
  
  const eventMatches = code.match(/#\[ink\(event\)\]\s*pub\s*struct\s+(\w+)/g);
  const events = eventMatches ? eventMatches.map(e => e.replace(/#\[ink\(event\)\]\s*pub\s*struct\s+/, '')) : [];
  
  const errorMatches = code.match(/pub\s*enum\s+(\w+Error)/g);
  const errors = errorMatches ? errorMatches.map(e => e.replace(/pub\s*enum\s+/, '')) : [];
  
  return {
    contractName,
    functions,
    events,
    errors
  };
}
