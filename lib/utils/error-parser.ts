export interface ParsedError {
  type: 'compilation' | 'runtime' | 'deployment' | 'unknown';
  message: string;
  suggestions: string[];
  relatedDocs: string[];
}

export function parseSubstrateError(errorMessage: string): ParsedError {
  const lowerError = errorMessage.toLowerCase();
  
  // Compilation errors
  if (lowerError.includes('compilation') || lowerError.includes('cargo') || lowerError.includes('rustc')) {
    return parseCompilationError(errorMessage);
  }
  
  // Runtime errors
  if (lowerError.includes('runtime') || lowerError.includes('execution')) {
    return parseRuntimeError(errorMessage);
  }
  
  // Deployment errors
  if (lowerError.includes('deploy') || lowerError.includes('instantiate')) {
    return parseDeploymentError(errorMessage);
  }
  
  return {
    type: 'unknown',
    message: errorMessage,
    suggestions: ['Revisa la documentación de ink!', 'Verifica la sintaxis del código'],
    relatedDocs: ['https://use.ink/']
  };
}

function parseCompilationError(error: string): ParsedError {
  const suggestions: string[] = [];
  const relatedDocs: string[] = [];
  
  if (error.includes('cannot find')) {
    suggestions.push('Verifica que todas las importaciones estén correctas');
    suggestions.push('Asegúrate de que las dependencias estén en Cargo.toml');
    relatedDocs.push('https://use.ink/getting-started/creating-an-ink-project');
  }
  
  if (error.includes('mismatched types')) {
    suggestions.push('Verifica los tipos de datos en las funciones');
    suggestions.push('Asegúrate de que los parámetros coincidan con los tipos esperados');
    relatedDocs.push('https://use.ink/basics/contracts');
  }
  
  if (error.includes('borrow checker')) {
    suggestions.push('Revisa las referencias y ownership en Rust');
    suggestions.push('Considera usar clone() si es necesario');
    relatedDocs.push('https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html');
  }
  
  if (error.includes('ink!')) {
    suggestions.push('Verifica que los atributos ink! estén correctos');
    suggestions.push('Asegúrate de usar la versión correcta de ink!');
    relatedDocs.push('https://use.ink/');
  }
  
  return {
    type: 'compilation',
    message: error,
    suggestions,
    relatedDocs
  };
}

function parseRuntimeError(error: string): ParsedError {
  const suggestions: string[] = [];
  const relatedDocs: string[] = [];
  
  if (error.includes('insufficient balance')) {
    suggestions.push('Verifica que la cuenta tenga suficientes tokens');
    suggestions.push('Revisa la lógica de transferencia de tokens');
    relatedDocs.push('https://use.ink/basics/contracts');
  }
  
  if (error.includes('permission denied')) {
    suggestions.push('Verifica los permisos de la función');
    suggestions.push('Asegúrate de que el caller tenga los permisos necesarios');
    relatedDocs.push('https://use.ink/basics/contracts');
  }
  
  if (error.includes('overflow')) {
    suggestions.push('Verifica las operaciones aritméticas');
    suggestions.push('Considera usar checked_add() para prevenir overflow');
    relatedDocs.push('https://doc.rust-lang.org/std/primitive.u32.html#method.checked_add');
  }
  
  return {
    type: 'runtime',
    message: error,
    suggestions,
    relatedDocs
  };
}

function parseDeploymentError(error: string): ParsedError {
  const suggestions: string[] = [];
  const relatedDocs: string[] = [];
  
  if (error.includes('insufficient funds')) {
    suggestions.push('Asegúrate de tener suficientes tokens para el deployment');
    suggestions.push('Verifica el balance de la cuenta');
    relatedDocs.push('https://polkadot.js.org/docs/');
  }
  
  if (error.includes('gas limit')) {
    suggestions.push('Aumenta el límite de gas para el deployment');
    suggestions.push('Optimiza el código para reducir el uso de gas');
    relatedDocs.push('https://use.ink/basics/contracts');
  }
  
  if (error.includes('network')) {
    suggestions.push('Verifica la conexión a la red');
    suggestions.push('Intenta conectar a una red diferente');
    relatedDocs.push('https://polkadot.js.org/docs/');
  }
  
  return {
    type: 'deployment',
    message: error,
    suggestions,
    relatedDocs
  };
}
