import { NextRequest, NextResponse } from 'next/server';
import { generateContractStream, explainCodeStream, debugErrorStream, chatStream } from '@/lib/ai/gemini';
import { generateTestsStream, explainTemplateStream, learningTutorStream, deploymentAssistantStream, analyticsInsightsStream, intelligentSearchStream, docsSearchStream } from '@/lib/ai/gemini-helpers';

export const runtime = 'nodejs';
export const maxDuration = 300; // Aumentado para tests completos (5 minutos)

interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  error?: string;
  data?: any;
  modelUsed?: string;
}

/**
 * POST /api/test-ai - Ejecuta tests completos de todas las funcionalidades de IA
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const results: TestResult[] = [];

  try {
    // Verificar API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY no está configurada',
        results: []
      }, { status: 500 });
    }

    // Test 1: Conexión básica
    try {
      const test1Start = Date.now();
      const { chatStream } = await import('@/lib/ai/gemini');
      let test1Response = '';
      
      for await (const chunk of chatStream('Responde solo con "OK"', [])) {
        test1Response += chunk;
      }
      
      results.push({
        testName: 'Conexión Básica',
        success: test1Response.length > 0,
        duration: Date.now() - test1Start,
        data: { response: test1Response.substring(0, 100) }
      });
    } catch (error: any) {
      results.push({
        testName: 'Conexión Básica',
        success: false,
        duration: 0,
        error: error.message
      });
    }

    // Tests de Generación de Contratos - Todas las combinaciones
    // 3 lenguajes x 3 niveles de complejidad = 9 tests
    
    const languages = ['ink', 'solidity', 'rust'] as const;
    const complexities = ['simple', 'intermedio', 'avanzado'] as const;
    
    for (const language of languages) {
      for (const complexity of complexities) {
        const testName = `Generación ${language.toUpperCase()} - ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}`;
        try {
          const testStart = Date.now();
          let testCode = '';
          
          const prompts = {
            ink: {
              simple: 'Genera un contrato ink! completo y funcional de almacenamiento simple. Debe incluir: #[ink::contract], struct con storage, constructor new(), función get() y función set(). Código completo y válido.',
              intermedio: 'Genera un contrato ink! completo de token ERC-20 (PSP-22). Debe incluir: total_supply, balances Mapping, funciones transfer, approve, transfer_from. Código completo y válido con todos los imports necesarios.',
              avanzado: 'Genera un contrato ink! COMPLETO y EXTENSO de DAO con gobernanza. DEBE incluir: #[ink::contract], storage completo (proposals Mapping, proposal_count, voting_period, quorum_threshold, staking_pool, stakers Mapping), Event enum completo (ProposalCreated, Voted, ProposalExecuted, Staked, RewardsClaimed), Error enum completo, constructor new(), funciones: propose(description), vote(proposal_id, support), execute(proposal_id), stake(amount), unstake(amount), claim_rewards(), get_proposal(id), get_staker_info(account). Código EXTENSO, COMPLETO, COMPILABLE y FUNCIONAL. Mínimo 400+ líneas. NO dejes nada sin implementar.'
            },
            solidity: {
              simple: 'Genera un contrato Solidity completo y funcional de almacenamiento simple. Debe incluir: pragma solidity, contract Storage, variable uint256 value, función set(uint256) y función get() returns (uint256). Código completo y válido.',
              intermedio: 'Genera un contrato Solidity completo de token ERC-20. Debe incluir: pragma solidity, contract Token, mapping balances, funciones transfer, approve, transferFrom. Código completo y válido.',
              avanzado: 'Genera un contrato Solidity COMPLETO y EXTENSO de DAO con gobernanza. DEBE incluir: // SPDX-License-Identifier: MIT, pragma solidity ^0.8.20, contract DAO, struct Proposal completo, mapping proposals, uint256 proposalCount, uint256 votingPeriod, uint256 quorumThreshold, Event enum completo (ProposalCreated, Voted, ProposalExecuted), Error enum, constructor, funciones: propose(string description), vote(uint256 proposalId, bool support), execute(uint256 proposalId), getProposal(uint256 id). Código EXTENSO, COMPLETO, COMPILABLE y FUNCIONAL. Mínimo 400+ líneas. NO dejes nada sin implementar.'
            },
            rust: {
              simple: 'Genera un pallet de Substrate COMPLETO y FUNCIONAL para almacenar un valor. DEBE incluir: #![cfg_attr(not(feature = "std"), no_std)], #[frame_support::pallet], #[pallet::pallet] con #[pallet::without_storage_info], Config trait con RuntimeEvent, StorageValue para el valor, Event enum, Error enum, y funciones call con #[pallet::call_index] y #[pallet::weight]: set_value(origin, value) y get_value(). Código COMPLETO, COMPILABLE y FUNCIONAL. NO dejes nada sin implementar.',
              intermedio: 'Genera un pallet de Substrate COMPLETO y FUNCIONAL para gestión de tokens. DEBE incluir: #![cfg_attr(not(feature = "std"), no_std)], #[frame_support::pallet], #[pallet::pallet] con #[pallet::without_storage_info], Config trait con RuntimeEvent, StorageMap para balances, StorageValue para total_supply, Event enum con Transfer/Mint/Burn, Error enum, y funciones call con #[pallet::call_index] y #[pallet::weight]: transfer(origin, to, amount), mint(origin, to, amount), burn(origin, amount), balance_of(origin, who). Código COMPLETO, COMPILABLE y FUNCIONAL. NO dejes nada sin implementar.',
              avanzado: 'Genera un pallet de Substrate COMPLETO y FUNCIONAL con gobernanza y staking. DEBE incluir: #![cfg_attr(not(feature = "std"), no_std)], #[frame_support::pallet], #[pallet::pallet] con #[pallet::without_storage_info], Config trait con RuntimeEvent y tipos necesarios, StorageMap para propuestas y stakers, StorageValue para contadores, Event enum completo (ProposalCreated, Voted, Staked, RewardsClaimed), Error enum completo, y funciones call con #[pallet::call_index] y #[pallet::weight]: propose(origin, description), vote(origin, proposal_id, support), stake(origin, amount), unstake(origin, amount), claim_rewards(origin). Código EXTENSO, COMPLETO, COMPILABLE y FUNCIONAL. NO dejes nada sin implementar. Mínimo 500+ líneas de código.'
            }
          };
          
          const contractTypes = {
            ink: { simple: 'Storage', intermedio: 'Token', avanzado: 'DAO' },
            solidity: { simple: 'Storage', intermedio: 'Token', avanzado: 'DAO' },
            rust: { simple: 'Storage', intermedio: 'Token', avanzado: 'Governance' }
          };
          
          for await (const chunk of generateContractStream(
            prompts[language][complexity],
            contractTypes[language][complexity],
            complexity,
            [],
            language
          )) {
            testCode += chunk;
          }
          
          // Validaciones específicas por lenguaje - más estrictas
          let isValid = false;
          if (language === 'ink') {
            isValid = testCode.length > 200 && (
              testCode.includes('#[ink::contract]') || 
              testCode.includes('#[ink(') ||
              (testCode.includes('ink') && testCode.includes('contract'))
            );
          } else if (language === 'solidity') {
            isValid = testCode.length > 200 && (
              testCode.includes('pragma solidity') || 
              (testCode.includes('contract') && testCode.includes('function'))
            );
          } else if (language === 'rust') {
            isValid = testCode.length > 200 && (
              testCode.includes('#[pallet::pallet]') || 
              testCode.includes('#[pallet') ||
              testCode.includes('#[frame_support::pallet]') ||
              testCode.includes('StorageValue') ||
              testCode.includes('StorageMap') ||
              (testCode.includes('pallet') && (testCode.includes('Storage') || testCode.includes('Config')))
            );
          }
          
          // Si no hay código, marcar como fallido con mensaje claro
          if (testCode.length === 0) {
            isValid = false;
            results.push({
              testName,
              success: false,
              duration: Date.now() - testStart,
              error: 'No se recibió código del modelo. El stream completó sin generar contenido.',
              data: { 
                codeLength: 0, 
                language,
                complexity,
                suggestion: 'Verifica que el modelo tenga acceso y que el prompt sea claro'
              }
            });
          } else {
            results.push({
              testName,
              success: isValid,
              duration: Date.now() - testStart,
              data: { 
                codeLength: testCode.length, 
                preview: testCode.substring(0, 150),
                language,
                complexity,
                ...(isValid ? {} : { warning: 'Código recibido pero no cumple validaciones del lenguaje' })
              }
            });
          }
        } catch (error: any) {
          results.push({
            testName,
            success: false,
            duration: 0,
            error: error.message,
            data: { language, complexity }
          });
        }
      }
    }

    // Código de ejemplo para tests
    const sampleCode = `#[ink::contract]
pub mod storage {
    #[ink(storage)]
    pub struct Storage {
        value: u32,
    }
    
    impl Storage {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self { value: 0 }
        }
    }
}`;

    // Tests de Explicación de Código - Diferentes lenguajes y enfoques
    const explanationTests = [
      {
        name: 'Explicación ink! - General',
        code: sampleCode,
        focus: 'general' as const
      },
      {
        name: 'Explicación ink! - Seguridad',
        code: sampleCode,
        focus: 'security' as const
      },
      {
        name: 'Explicación Solidity',
        code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;
    
    event ValueChanged(uint256 newValue);
    
    function set(uint256 _value) public {
        storedValue = _value;
        emit ValueChanged(_value);
    }
    
    function get() public view returns (uint256) {
        return storedValue;
    }
}`,
        focus: 'general' as const
      },
      {
        name: 'Explicación Rust Substrate',
        code: `#[pallet::pallet]
pub struct Pallet<T>(_);

#[pallet::storage]
pub type Value<T: Config> = StorageValue<_, u32, ValueQuery>;

#[pallet::call]
impl<T: Config> Pallet<T> {
    #[pallet::call_index(0)]
    pub fn set_value(origin: OriginFor<T>, value: u32) -> DispatchResult {
        let _ = ensure_signed(origin)?;
        Value::<T>::put(value);
        Ok(())
    }
}`,
        focus: 'general' as const
      }
    ];

    for (const test of explanationTests) {
      try {
        const testStart = Date.now();
        let explanation = '';
        
        for await (const chunk of explainCodeStream(test.code, test.focus)) {
          explanation += chunk;
        }
        
        // Validación más estricta para explicaciones
        const isValid = explanation.length > 100 && (
          explanation.toLowerCase().includes('contrato') ||
          explanation.toLowerCase().includes('función') ||
          explanation.toLowerCase().includes('function') ||
          explanation.toLowerCase().includes('código') ||
          explanation.toLowerCase().includes('code') ||
          explanation.toLowerCase().includes('explica') ||
          explanation.toLowerCase().includes('hace')
        );
        
        if (explanation.length === 0) {
          results.push({
            testName: test.name,
            success: false,
            duration: Date.now() - testStart,
            error: 'No se recibió explicación del modelo',
            data: { explanationLength: 0, focus: test.focus }
          });
        } else {
          results.push({
            testName: test.name,
            success: isValid,
            duration: Date.now() - testStart,
            data: { 
              explanationLength: explanation.length, 
              focus: test.focus,
              ...(isValid ? {} : { warning: 'Explicación recibida pero muy corta o no relevante' })
            }
          });
        }
      } catch (error: any) {
        results.push({
          testName: test.name,
          success: false,
          duration: 0,
          error: error.message
        });
      }
    }

    // Tests de Debug de Errores - Diferentes tipos de errores
    const debugTests = [
      {
        name: 'Debug - Error de Compilación ink!',
        error: 'error[E0425]: cannot find value `x` in this scope\n  --> src/lib.rs:15:20\n   |\n15 |         let result = x + 1;\n   |                     ^ not found in this scope',
        code: `#[ink::contract]
pub mod storage {
    #[ink(storage)]
    pub struct Storage {
        value: u32,
    }
    
    impl Storage {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self { value: 0 }
        }
        
        #[ink(message)]
        pub fn get(&self) -> u32 {
            let result = x + 1; // Error: x no está definido
            self.value
        }
    }
}`,
        context: 'Compilación'
      },
      {
        name: 'Debug - Error de Tipo Solidity',
        error: 'TypeError: Member "balance" not found or not visible after argument-dependent lookup',
        code: `pragma solidity ^0.8.0;
contract Token {
    function transfer(address to, uint256 amount) public {
        to.balance += amount;
    }
}`,
        context: 'Compilación'
      },
      {
        name: 'Debug - Error de Runtime Rust',
        error: 'thread panicked at "attempt to subtract with overflow"',
        code: `#[ink::contract]
pub mod token {
    #[ink(message)]
    pub fn transfer(&mut self, to: AccountId, value: Balance) {
        self.balances[to] += value;
        self.balances[self.env().caller()] -= value;
    }
}`,
        context: 'Runtime'
      },
      {
        name: 'Debug - Error de Lógica',
        error: 'Error: Insufficient balance for transfer. Account has 100 tokens but trying to transfer 200.',
        code: `#[ink::contract]
pub mod token {
    #[ink(storage)]
    pub struct Token {
        balances: Mapping<AccountId, Balance>,
    }
    
    impl Token {
        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, value: Balance) -> Result<(), Error> {
            let from = self.env().caller();
            let from_balance = self.balances.get(from).unwrap_or(0);
            
            if from_balance < value {
                return Err(Error::InsufficientBalance);
            }
            
            self.balances.insert(from, &(from_balance - value));
            let to_balance = self.balances.get(to).unwrap_or(0);
            self.balances.insert(to, &(to_balance + value));
            
            Ok(())
        }
    }
}`,
        context: 'Lógica de Negocio'
      }
    ];

    for (const test of debugTests) {
      try {
        const testStart = Date.now();
        let debugResult = '';
        
        for await (const chunk of debugErrorStream(
          test.error,
          test.code,
          test.context
        )) {
          debugResult += chunk;
        }
        
        // Validación más flexible para debug
        const isValid = debugResult.length > 50 && (
          debugResult.toLowerCase().includes('error') ||
          debugResult.toLowerCase().includes('problema') ||
          debugResult.toLowerCase().includes('solución') ||
          debugResult.toLowerCase().includes('fix') ||
          debugResult.toLowerCase().includes('corregir') ||
          debugResult.toLowerCase().includes('causa') ||
          debugResult.toLowerCase().includes('debug') ||
          debugResult.toLowerCase().includes('corrección') ||
          debugResult.toLowerCase().includes('código')
        );
        
        if (debugResult.length === 0) {
          results.push({
            testName: test.name,
            success: false,
            duration: Date.now() - testStart,
            error: 'No se recibió respuesta de debug del modelo',
            data: { debugLength: 0, context: test.context }
          });
        } else {
          results.push({
            testName: test.name,
            success: isValid,
            duration: Date.now() - testStart,
            data: { 
              debugLength: debugResult.length, 
              context: test.context,
              ...(isValid ? {} : { warning: 'Respuesta recibida pero no parece ser una solución de debug válida' })
            }
          });
        }
      } catch (error: any) {
        results.push({
          testName: test.name,
          success: false,
          duration: 0,
          error: error.message
        });
      }
    }

    // Tests de Chat Conversacional - Diferentes temas
    const chatTests = [
      {
        name: 'Chat - Pregunta sobre ink!',
        message: '¿Qué es ink!?',
        history: []
      },
      {
        name: 'Chat - Pregunta sobre Substrate',
        message: 'Explica qué es Substrate y cómo funciona el framework de desarrollo de blockchains',
        history: []
      },
      {
        name: 'Chat - Pregunta sobre Polkadot',
        message: '¿Qué es Polkadot y cómo funciona?',
        history: []
      },
      {
        name: 'Chat - Conversación con historial',
        message: '¿Cómo despliego un contrato?',
        history: [
          { role: 'user' as const, parts: 'Hola, necesito ayuda con contratos' },
          { role: 'model' as const, parts: 'Hola, puedo ayudarte con contratos ink!' }
        ]
      }
    ];

    for (const test of chatTests) {
      try {
        const testStart = Date.now();
        let chatResponse = '';
        
        for await (const chunk of chatStream(test.message, test.history)) {
          chatResponse += chunk;
        }
        
        // Validación más estricta para chat
        const isValid = chatResponse.length > 100 && (
          chatResponse.toLowerCase().includes('substrate') ||
          chatResponse.toLowerCase().includes('ink') ||
          chatResponse.toLowerCase().includes('polkadot') ||
          chatResponse.toLowerCase().includes('blockchain') ||
          chatResponse.toLowerCase().includes('contrato') ||
          chatResponse.length > 200 // Si es muy largo, probablemente es válido
        );
        
        if (chatResponse.length === 0) {
          results.push({
            testName: test.name,
            success: false,
            duration: Date.now() - testStart,
            error: 'No se recibió respuesta del chat del modelo',
            data: { responseLength: 0, hasHistory: test.history.length > 0 }
          });
        } else {
          results.push({
            testName: test.name,
            success: isValid,
            duration: Date.now() - testStart,
            data: { 
              responseLength: chatResponse.length, 
              hasHistory: test.history.length > 0,
              ...(isValid ? {} : { warning: 'Respuesta recibida pero muy corta o no relevante al tema' })
            }
          });
        }
      } catch (error: any) {
        results.push({
          testName: test.name,
          success: false,
          duration: 0,
          error: error.message
        });
      }
    }

    // Tests de Generación de Tests - Diferentes lenguajes
    const testGenerationTests = [
      {
        name: 'Generación Tests - ink!',
        code: sampleCode,
        contractType: 'ink'
      },
      {
        name: 'Generación Tests - Solidity',
        code: `pragma solidity ^0.8.0;
contract Token {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`,
        contractType: 'solidity'
      },
      {
        name: 'Generación Tests - Rust Substrate',
        code: `#[pallet::pallet]
pub struct Pallet<T>(_);

#[pallet::storage]
pub type Value<T: Config> = StorageValue<_, u32, ValueQuery>;

#[pallet::call]
impl<T: Config> Pallet<T> {
    #[pallet::call_index(0)]
    pub fn set_value(origin: OriginFor<T>, value: u32) -> DispatchResult {
        let _ = ensure_signed(origin)?;
        Value::<T>::put(value);
        Ok(())
    }
}`,
        contractType: 'rust'
      }
    ];

    for (const test of testGenerationTests) {
      try {
        const testStart = Date.now();
        let generatedTests = '';
        
        for await (const chunk of generateTestsStream(test.code, test.contractType)) {
          generatedTests += chunk;
        }
        
        // Validación más flexible para tests generados
        const isValid = generatedTests.length > 100 && (
          generatedTests.toLowerCase().includes('test') || 
          generatedTests.toLowerCase().includes('it(') ||
          generatedTests.toLowerCase().includes('describe') ||
          generatedTests.toLowerCase().includes('#[ink::test]') ||
          generatedTests.toLowerCase().includes('fn test') ||
          generatedTests.toLowerCase().includes('function test') ||
          generatedTests.toLowerCase().includes('assert') ||
          generatedTests.toLowerCase().includes('expect') ||
          generatedTests.toLowerCase().includes('#[test]') ||
          generatedTests.toLowerCase().includes('#[cfg(test)]') ||
          generatedTests.toLowerCase().includes('mod tests')
        );
        
        if (generatedTests.length === 0) {
          results.push({
            testName: test.name,
            success: false,
            duration: Date.now() - testStart,
            error: 'No se recibieron tests generados del modelo',
            data: { testsLength: 0, contractType: test.contractType }
          });
        } else {
          results.push({
            testName: test.name,
            success: isValid,
            duration: Date.now() - testStart,
            data: { 
              testsLength: generatedTests.length, 
              contractType: test.contractType,
              ...(isValid ? {} : { warning: 'Tests recibidos pero no parecen ser código de tests válido' })
            }
          });
        }
      } catch (error: any) {
        results.push({
          testName: test.name,
          success: false,
          duration: 0,
          error: error.message
        });
      }
    }

    // Tests de Explicación de Plantillas - Diferentes tipos
    const templateTests = [
      {
        name: 'Explicación Plantilla - Storage',
        code: sampleCode,
        templateName: 'Storage Contract'
      },
      {
        name: 'Explicación Plantilla - Token ERC-20',
        code: `#[ink::contract]
pub mod erc20 {
    #[ink(storage)]
    pub struct Erc20 {
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
    }
    
    impl Erc20 {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            Self {
                total_supply: initial_supply,
                balances: Mapping::default(),
            }
        }
    }
}`,
        templateName: 'ERC-20 Token Contract'
      },
      {
        name: 'Explicación Plantilla - NFT',
        code: `#[ink::contract]
pub mod nft {
    #[ink(storage)]
    pub struct Nft {
        next_token_id: u32,
        token_owner: Mapping<u32, AccountId>,
    }
    
    impl Nft {
        #[ink(message)]
        pub fn mint(&mut self, to: AccountId) -> u32 {
            let token_id = self.next_token_id;
            self.token_owner.insert(token_id, &to);
            self.next_token_id += 1;
            token_id
        }
    }
}`,
        templateName: 'NFT Collection Contract'
      }
    ];

    for (const test of templateTests) {
      try {
        const testStart = Date.now();
        let explanation = '';
        
        for await (const chunk of explainTemplateStream(test.code, test.templateName)) {
          explanation += chunk;
        }
        
        // Validación más estricta para explicación de plantillas
        const isValid = explanation.length > 100 && (
          explanation.toLowerCase().includes('plantilla') ||
          explanation.toLowerCase().includes('contrato') ||
          explanation.toLowerCase().includes('función') ||
          explanation.toLowerCase().includes('código') ||
          explanation.toLowerCase().includes('uso')
        );
        
        results.push({
          testName: test.name,
          success: isValid,
          duration: Date.now() - testStart,
          data: { 
            explanationLength: explanation.length, 
            templateName: test.templateName,
            ...(isValid ? {} : { warning: 'Explicación recibida pero muy corta o no relevante' })
          }
        });
      } catch (error: any) {
        results.push({
          testName: test.name,
          success: false,
          duration: 0,
          error: error.message
        });
      }
    }

    // Tests de Tutor de Aprendizaje - Diferentes niveles
    const tutorTests = [
      {
        name: 'Tutor - Nivel Principiante',
        question: '¿Qué es un smart contract?',
        learningPath: 'Principiante',
        progress: 0
      },
      {
        name: 'Tutor - Nivel Intermedio',
        question: '¿Cómo funcionan los eventos en ink!?',
        learningPath: 'Intermedio',
        progress: 50
      },
      {
        name: 'Tutor - Nivel Avanzado',
        question: '¿Cómo implementar cross-chain messaging en Substrate?',
        learningPath: 'Avanzado',
        progress: 80
      }
    ];

    for (const test of tutorTests) {
      try {
        const testStart = Date.now();
        let tutorResponse = '';
        
        for await (const chunk of learningTutorStream(
          test.question,
          test.learningPath,
          test.progress
        )) {
          tutorResponse += chunk;
        }
        
        results.push({
          testName: test.name,
          success: tutorResponse.length > 50,
          duration: Date.now() - testStart,
          data: { responseLength: tutorResponse.length, level: test.learningPath }
        });
      } catch (error: any) {
        results.push({
          testName: test.name,
          success: false,
          duration: 0,
          error: error.message
        });
      }
    }

    // Tests de Asistente de Deployment - Diferentes escenarios
    const deploymentTests = [
      {
        name: 'Deployment - Contrato ink!',
        code: sampleCode,
        question: '¿Cómo despliego este contrato ink! en Paseo?'
      },
      {
        name: 'Deployment - Contrato Solidity',
        code: `pragma solidity ^0.8.0;
contract Token {
    uint256 public totalSupply;
}`,
        question: '¿Cómo despliego este contrato Solidity en una red EVM?'
      },
      {
        name: 'Deployment - Pallet Substrate',
        code: `#[pallet::pallet]
pub struct Pallet<T>(_);`,
        question: '¿Cómo integro este pallet en mi runtime de Substrate?'
      },
      // Tests específicos para cada red de Polkadot
      {
        name: 'Deployment - Paseo Testnet',
        code: sampleCode,
        question: `Necesito desplegar este contrato ink! en Paseo Testnet. 
Información de la red:
- RPC Endpoint: wss://paseo.rpc.amforc.com
- Símbolo: PAS
- Decimales: 10
- Tipo: Testnet (sin valor económico)
- Faucet: https://faucet.polkadot.io/ (seleccionar Paseo)
- Explorador: https://paseo.subscan.io/

Proporciona una guía completa de deployment con todos los pasos necesarios.`
      },
      {
        name: 'Deployment - Westend Testnet',
        code: sampleCode,
        question: `Necesito desplegar este contrato ink! en Westend Testnet. 
Información de la red:
- RPC Endpoint: wss://westend-rpc.polkadot.io
- Símbolo: WND
- Decimales: 12
- Tipo: Testnet (sin valor económico)
- Faucet: https://faucet.polkadot.io/ (seleccionar Westend)
- Explorador: https://westend.subscan.io/

Proporciona una guía completa de deployment con todos los pasos necesarios.`
      },
      {
        name: 'Deployment - Polkadot Mainnet',
        code: sampleCode,
        question: `Necesito desplegar este contrato ink! en Polkadot Mainnet (PRODUCCIÓN). 
Información de la red:
- RPC Endpoint: wss://rpc.polkadot.io
- Símbolo: DOT
- Decimales: 10
- Tipo: Mainnet (producción - tokens con valor económico)
- Explorador: https://polkadot.subscan.io/
- ⚠️ IMPORTANTE: Esta es la red de producción. Los tokens DOT tienen valor real.

Proporciona una guía completa de deployment con todos los pasos necesarios, verificaciones de seguridad y mejores prácticas para mainnet.`
      }
    ];

    for (const test of deploymentTests) {
      try {
        const testStart = Date.now();
        let deploymentResponse = '';
        
        for await (const chunk of deploymentAssistantStream(test.code, test.question)) {
          deploymentResponse += chunk;
        }
        
        // Validación más estricta para deployment
        // Validaciones específicas por tipo de red
        const isNetworkSpecific = test.name.includes('Paseo') || test.name.includes('Westend') || test.name.includes('Polkadot Mainnet');
        const networkKeywords = isNetworkSpecific 
          ? (test.name.includes('Paseo') 
              ? ['paseo', 'pas', 'wss://paseo']
              : test.name.includes('Westend')
              ? ['westend', 'wnd', 'wss://westend']
              : ['polkadot', 'mainnet', 'dot', 'wss://rpc.polkadot', 'producción'])
          : [];
        
        // Validación más flexible: acepta respuestas más cortas si contienen información útil
        const isValid = deploymentResponse.length > 150 && (
          deploymentResponse.toLowerCase().includes('deploy') ||
          deploymentResponse.toLowerCase().includes('desplieg') ||
          deploymentResponse.toLowerCase().includes('paso') ||
          deploymentResponse.toLowerCase().includes('comando') ||
          deploymentResponse.toLowerCase().includes('configuración') ||
          deploymentResponse.toLowerCase().includes('instrucción') ||
          deploymentResponse.toLowerCase().includes('rpc') ||
          deploymentResponse.toLowerCase().includes('compil') ||
          deploymentResponse.toLowerCase().includes('cargo') ||
          deploymentResponse.toLowerCase().includes('polkadot.js') ||
          (isNetworkSpecific && networkKeywords.some(keyword => deploymentResponse.toLowerCase().includes(keyword)))
        );
        
        if (deploymentResponse.length === 0) {
          results.push({
            testName: test.name,
            success: false,
            duration: Date.now() - testStart,
            error: 'No se recibió respuesta del asistente de deployment',
            data: { responseLength: 0 }
          });
        } else {
          results.push({
            testName: test.name,
            success: isValid,
            duration: Date.now() - testStart,
            data: { 
              responseLength: deploymentResponse.length,
              network: isNetworkSpecific ? test.name.split(' - ')[1] : undefined,
              ...(isValid ? {} : { warning: 'Respuesta recibida pero no parece ser una guía de deployment completa' })
            }
          });
        }
      } catch (error: any) {
        results.push({
          testName: test.name,
          success: false,
          duration: 0,
          error: error.message
        });
      }
    }

    // Test 10: Insights de analytics
    try {
      const test10Start = Date.now();
      let test10Insights = '';
      
      for await (const chunk of analyticsInsightsStream({
        contractsGenerated: 10,
        usersActive: 5,
        timeSaved: '2 horas',
        deployments: 3
      }, '¿Qué insights puedes darme?')) {
        test10Insights += chunk;
      }
      
      // Validación más flexible para analytics
      const isValid = test10Insights.length > 150 && (
        test10Insights.toLowerCase().includes('insight') ||
        test10Insights.toLowerCase().includes('análisis') ||
        test10Insights.toLowerCase().includes('tendencia') ||
        test10Insights.toLowerCase().includes('recomendación') ||
        test10Insights.toLowerCase().includes('métrica') ||
        test10Insights.toLowerCase().includes('dato') ||
        test10Insights.toLowerCase().includes('usuario') ||
        test10Insights.toLowerCase().includes('plataforma') ||
        test10Insights.toLowerCase().includes('crecimiento')
      );
      
      if (test10Insights.length === 0) {
        results.push({
          testName: 'Insights de Analytics',
          success: false,
          duration: Date.now() - test10Start,
          error: 'No se recibieron insights del modelo',
          data: { responseLength: 0 }
        });
      } else {
        results.push({
          testName: 'Insights de Analytics',
          success: isValid,
          duration: Date.now() - test10Start,
          data: { 
            responseLength: test10Insights.length,
            ...(isValid ? {} : { warning: 'Insights recibidos pero muy cortos o no relevantes' })
          }
        });
      }
    } catch (error: any) {
      results.push({
        testName: 'Insights de Analytics',
        success: false,
        duration: 0,
        error: error.message
      });
    }

    // Test 11: Búsqueda inteligente en marketplace
    try {
      const test11Start = Date.now();
      let test11Search = '';
      
      const mockTemplates = [
        { title: 'ERC-20 Token', description: 'Token estándar', category: 'Tokens', tags: ['token', 'erc20'] },
        { title: 'NFT Collection', description: 'Colección de NFTs', category: 'NFT', tags: ['nft', 'collection'] }
      ];
      
      for await (const chunk of intelligentSearchStream('token', mockTemplates)) {
        test11Search += chunk;
      }
      
      // Validación más estricta para búsqueda inteligente
      const isValid = test11Search.length > 100 && (
        test11Search.toLowerCase().includes('plantilla') ||
        test11Search.toLowerCase().includes('recomend') ||
        test11Search.toLowerCase().includes('categoría') ||
        test11Search.toLowerCase().includes('tag') ||
        test11Search.toLowerCase().includes('búsqueda')
      );
      
      results.push({
        testName: 'Búsqueda Inteligente Marketplace',
        success: isValid,
        duration: Date.now() - test11Start,
        data: { 
          responseLength: test11Search.length,
          ...(isValid ? {} : { warning: 'Respuesta recibida pero muy corta o no relevante' })
        }
      });
    } catch (error: any) {
      results.push({
        testName: 'Búsqueda Inteligente Marketplace',
        success: false,
        duration: 0,
        error: error.message
      });
    }

    // Test 12: Búsqueda inteligente en docs
    try {
      const test12Start = Date.now();
      let test12Search = '';
      
      const mockDocSections = [
        { title: 'Comenzar', description: 'Guía de inicio rápido' },
        { title: 'Contratos', description: 'Desarrollo de contratos inteligentes' }
      ];
      
      for await (const chunk of docsSearchStream('contrato', mockDocSections)) {
        test12Search += chunk;
      }
      
      // Validación más estricta para búsqueda en docs
      const isValid = test12Search.length > 100 && (
        test12Search.toLowerCase().includes('sección') ||
        test12Search.toLowerCase().includes('documentación') ||
        test12Search.toLowerCase().includes('concepto') ||
        test12Search.toLowerCase().includes('polkadot') ||
        test12Search.toLowerCase().includes('substrate')
      );
      
      results.push({
        testName: 'Búsqueda Inteligente Docs',
        success: isValid,
        duration: Date.now() - test12Start,
        data: { 
          responseLength: test12Search.length,
          ...(isValid ? {} : { warning: 'Respuesta recibida pero muy corta o no relevante' })
        }
      });
    } catch (error: any) {
      results.push({
        testName: 'Búsqueda Inteligente Docs',
        success: false,
        duration: 0,
        error: error.message
      });
    }

    const totalDuration = Date.now() - startTime;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: failedTests === 0,
      summary: {
        total: results.length,
        passed: passedTests,
        failed: failedTests,
        totalDuration
      },
      results
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      results
    }, { status: 500 });
  }
}

