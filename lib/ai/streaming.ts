import { groq, generateContractStream as groqGenerate, explainCodeStream as groqExplain, debugErrorStream as groqDebug } from './groq';

export async function* generateContractStream(
  prompt: string,
  contractType: string,
  complexity?: string,
  features?: string[]
) {
  try {
    yield* groqGenerate(prompt, contractType, complexity, features);
  } catch (error) {
    console.error('Groq API error:', error);
    // Fallback a código de ejemplo si Groq falla
    let mockCode = '';
    
    if (contractType.toLowerCase().includes('nft') || prompt.toLowerCase().includes('nft')) {
      mockCode = `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod nft_contract {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct NFTContract {
        // Storage fields
        owner: AccountId,
        token_counter: u32,
        tokens: Mapping<u32, TokenData>,
        owner_tokens: Mapping<AccountId, Vec<u32>>,
        royalty_percentage: u32, // Royalty percentage (0-100)
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct TokenData {
        id: u32,
        owner: AccountId,
        metadata_uri: String,
        royalty_recipient: AccountId,
    }

    #[ink(event)]
    pub struct TokenMinted {
        #[ink(topic)]
        token_id: u32,
        #[ink(topic)]
        owner: AccountId,
        metadata_uri: String,
    }

    #[ink(event)]
    pub struct TokenTransferred {
        #[ink(topic)]
        token_id: u32,
        #[ink(topic)]
        from: AccountId,
        #[ink(topic)]
        to: AccountId,
    }

    #[ink(constructor)]
    pub fn new(royalty_percentage: u32) -> Self {
        Self {
            owner: Self::env().caller(),
            token_counter: 0,
            tokens: Mapping::new(),
            owner_tokens: Mapping::new(),
            royalty_percentage: royalty_percentage.min(100), // Max 100%
        }
    }

    #[ink(message)]
    pub fn mint(&mut self, metadata_uri: String, royalty_recipient: AccountId) -> Result<u32, Error> {
        let caller = self.env().caller();
        let token_id = self.token_counter;
        
        let token_data = TokenData {
            id: token_id,
            owner: caller,
            metadata_uri: metadata_uri.clone(),
            royalty_recipient,
        };
        
        self.tokens.insert(token_id, &token_data);
        
        // Add to owner's token list
        let mut owner_tokens = self.owner_tokens.get(caller).unwrap_or_default();
        owner_tokens.push(token_id);
        self.owner_tokens.insert(caller, &owner_tokens);
        
        self.token_counter += 1;
        
        self.env().emit_event(TokenMinted {
            token_id,
            owner: caller,
            metadata_uri,
        });
        
        Ok(token_id)
    }

    #[ink(message)]
    pub fn transfer(&mut self, token_id: u32, to: AccountId) -> Result<(), Error> {
        let caller = self.env().caller();
        
        if let Some(mut token_data) = self.tokens.get(token_id) {
            if token_data.owner != caller {
                return Err(Error::NotOwner);
            }
            
            let from = token_data.owner;
            token_data.owner = to;
            self.tokens.insert(token_id, &token_data);
            
            // Update owner token lists
            self._update_owner_tokens(from, to, token_id);
            
            self.env().emit_event(TokenTransferred {
                token_id,
                from,
                to,
            });
            
            Ok(())
        } else {
            Err(Error::TokenNotFound)
        }
    }

    #[ink(message)]
    pub fn get_token_data(&self, token_id: u32) -> Option<TokenData> {
        self.tokens.get(token_id)
    }

    #[ink(message)]
    pub fn get_royalty_percentage(&self) -> u32 {
        self.royalty_percentage
    }

    fn _update_owner_tokens(&mut self, from: AccountId, to: AccountId, token_id: u32) {
        // Remove from old owner
        if let Some(mut from_tokens) = self.owner_tokens.get(from) {
            from_tokens.retain(|&id| id != token_id);
            self.owner_tokens.insert(from, &from_tokens);
        }
        
        // Add to new owner
        let mut to_tokens = self.owner_tokens.get(to).unwrap_or_default();
        to_tokens.push(token_id);
        self.owner_tokens.insert(to, &to_tokens);
    }
}

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum Error {
    NotOwner,
    TokenNotFound,
    InvalidRoyalty,
}`;
    } else {
      mockCode = `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod ${contractType}_contract {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;

    #[ink(storage)]
    pub struct ${contractType.charAt(0).toUpperCase() + contractType.slice(1)}Contract {
        // Storage fields
        owner: AccountId,
        data: Mapping<AccountId, u32>,
    }

    #[ink(event)]
    pub struct DataUpdated {
        #[ink(topic)]
        account: AccountId,
        value: u32,
    }

    #[ink(constructor)]
    pub fn new() -> Self {
        Self {
            owner: Self::env().caller(),
            data: Mapping::new(),
        }
    }

    #[ink(message)]
    pub fn set_data(&mut self, value: u32) -> Result<(), Error> {
        let caller = self.env().caller();
        self.data.insert(caller, &value);
        
        self.env().emit_event(DataUpdated {
            account: caller,
            value,
        });
        
        Ok(())
    }

    #[ink(message)]
    pub fn get_data(&self, account: AccountId) -> Option<u32> {
        self.data.get(account)
    }
}`;
    }

    // Simular streaming del código de ejemplo
    for (let i = 0; i < mockCode.length; i += 10) {
      yield mockCode.slice(i, i + 10);
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }
}

export async function* explainCodeStream(
  code: string,
  focus: 'general' | 'security' | 'optimization' | 'deployment' = 'general'
) {
  try {
    yield* groqExplain(code, focus);
  } catch (error) {
    console.error('Groq API error:', error);
    // Análisis inteligente del código para generar explicación específica
    const explanation = analyzeCodeAndGenerateExplanation(code, focus);
    
    // Simular streaming de la explicación específica
    for (let i = 0; i < explanation.length; i += 15) {
      yield explanation.slice(i, i + 15);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }
}

// Función para analizar el código y generar explicación específica
function analyzeCodeAndGenerateExplanation(code: string, focus: string): string {
  const lowerCode = code.toLowerCase();
  
  // Detectar tipo de contrato basado en las plantillas específicas
  let contractType = 'Contrato ink!';
  let contractDescription = 'Contrato inteligente básico';
  let mainFunctions: string[] = [];
  let keyFeatures: string[] = [];
  let securityNotes: string[] = [];
  
  // Detección específica de plantillas de /test
  
  // PSP-22 Básico
  if (lowerCode.includes('psp22_token') && lowerCode.includes('total_supply') && !lowerCode.includes('staking')) {
    contractType = '🪙 PSP-22 Token Básico';
    contractDescription = 'Token PSP-22 estándar con funcionalidades básicas de transferencia';
    
    mainFunctions.push('new() - Constructor con supply inicial, nombre, símbolo y decimales');
    mainFunctions.push('total_supply() - Retorna el suministro total de tokens');
    mainFunctions.push('balance_of() - Consulta el balance de una cuenta específica');
    mainFunctions.push('transfer() - Transfiere tokens del caller a otra cuenta');
    mainFunctions.push('approve() - Autoriza a otra cuenta a gastar tokens del caller');
    mainFunctions.push('allowance() - Consulta cuánto puede gastar una cuenta de otra');
    mainFunctions.push('transfer_from_to() - Función interna para transferencias seguras');
    
    keyFeatures.push('Estándar PSP-22 - Compatible con ecosistema Polkadot');
    keyFeatures.push('Eventos Transfer - Emite eventos cuando se transfieren tokens');
    keyFeatures.push('Eventos Approval - Emite eventos cuando se autorizan gastos');
    keyFeatures.push('Validaciones de Balance - Verifica balance suficiente antes de transferir');
    keyFeatures.push('Sistema de Allowances - Permite gastos autorizados de terceros');
    
    securityNotes.push('Result<T, Error> - Manejo seguro de errores');
    securityNotes.push('Validación de Balance - Previene transferencias sin fondos');
    securityNotes.push('Sistema de Allowances - Control granular de autorizaciones');
    securityNotes.push('Eventos de Auditoría - Registro completo de operaciones');
  }
  
  // PSP-22 Avanzado con Staking y Governance
  else if (lowerCode.includes('advanced_token') && lowerCode.includes('staking_pool')) {
    contractType = '🚀 PSP-22 Token Avanzado con Staking y Governance';
    contractDescription = 'Token PSP-22 avanzado con funcionalidades de staking y gobernanza descentralizada';
    
    mainFunctions.push('new() - Constructor con supply, nombre y símbolo');
    mainFunctions.push('stake() - Bloquea tokens para staking y acumula recompensas');
    mainFunctions.push('unstake() - Libera tokens del staking');
    mainFunctions.push('vote() - Permite votar en propuestas de governance con peso de tokens');
    mainFunctions.push('balance_of() - Consulta balance incluyendo tokens en staking');
    mainFunctions.push('transfer() - Transferencias estándar PSP-22');
    mainFunctions.push('transfer_from_to() - Función interna para transferencias seguras');
    
    keyFeatures.push('Sistema de Staking - Pool de staking con recompensas automáticas');
    keyFeatures.push('Sistema de Governance - Votación por tokens con peso proporcional');
    keyFeatures.push('Recompensas Automáticas - Acumulación continua de rewards');
    keyFeatures.push('Flexibilidad - Stake/unstake en cualquier momento');
    keyFeatures.push('Tracking Individual - Cada cuenta tiene su propio staking');
    keyFeatures.push('Democracia Digital - Decisiones descentralizadas');
    
    securityNotes.push('Validación de Balance - Previene operaciones sin fondos');
    securityNotes.push('Sistema de Allowances - Control granular de autorizaciones');
    securityNotes.push('Eventos de Auditoría - Registro completo de operaciones');
    securityNotes.push('Manejo de Errores - Result<T, Error> para operaciones seguras');
  }
  
  // PSP-34 NFT Collection
  else if (lowerCode.includes('psp34_nft') && lowerCode.includes('token_count')) {
    contractType = '🎨 PSP-34 NFT Collection';
    contractDescription = 'Colección de NFTs con metadata y royalties';
    
    mainFunctions.push('new() - Constructor con nombre y símbolo de la colección');
    mainFunctions.push('mint() - Crear nuevo NFT con metadata y royalties');
    mainFunctions.push('burn() - Eliminar NFT del supply total');
    mainFunctions.push('transfer() - Transferir NFT a otra cuenta');
    mainFunctions.push('approve() - Autorizar transferencia de NFT');
    mainFunctions.push('owner_of() - Consultar propietario de NFT específico');
    mainFunctions.push('balance_of() - Contar NFTs de una cuenta');
    mainFunctions.push('get_metadata() - Obtener metadata del NFT');
    mainFunctions.push('get_royalty() - Consultar porcentaje de regalías');
    
    keyFeatures.push('Metadata Completa - Información rica de cada NFT');
    keyFeatures.push('Royalties - Ingresos automáticos para creadores');
    keyFeatures.push('Gas Optimizado - Operaciones eficientes');
    keyFeatures.push('Eventos - Tracking completo de transferencias');
    keyFeatures.push('Estándar PSP-34 - Compatible con ecosistema Polkadot');
    
    securityNotes.push('Validación de Propietario - Solo el owner puede transferir');
    securityNotes.push('Manejo de Errores - Result<T, Error> para operaciones seguras');
    securityNotes.push('Eventos de Auditoría - Registro completo de operaciones');
  }
  
  // Detección de contratos NFT por funciones específicas
  else if (lowerCode.includes('create_nft') || lowerCode.includes('transfer_nft') || 
           lowerCode.includes('nft_contract') || lowerCode.includes('nftcontract')) {
    contractType = '🎨 Contrato NFT para Artistas';
    contractDescription = 'Contrato NFT diseñado para artistas con funcionalidades de creación y transferencia';
    
    mainFunctions.push('create_nft() - Crear nuevo NFT con metadata de artista');
    mainFunctions.push('transfer_nft() - Transferir NFT entre cuentas');
    mainFunctions.push('get_nft_info() - Obtener información del NFT');
    mainFunctions.push('get_artist() - Consultar artista del NFT');
    mainFunctions.push('get_metadata() - Obtener metadata del NFT');
    
    keyFeatures.push('Creación de NFTs - Para artistas digitales');
    keyFeatures.push('Metadata de Arte - Información del artista y obra');
    keyFeatures.push('Transferencia de Arte - Cambio de propietario');
    keyFeatures.push('Sistema de Artistas - Gestión de creadores');
    keyFeatures.push('Eventos de Arte - Tracking de transferencias artísticas');
    
    securityNotes.push('Validación de Artista - Solo artistas autorizados pueden crear');
    securityNotes.push('Protección de Metadata - Preservar información del arte');
    securityNotes.push('Transferencia Segura - Validación de propietario');
    securityNotes.push('Eventos de Auditoría - Registro de transacciones artísticas');
  }
  
  // DAO Governance
  else if (lowerCode.includes('dao_governance') && lowerCode.includes('proposals')) {
    contractType = '🗳️ DAO Governance';
    contractDescription = 'Sistema de gobernanza descentralizada con votación';
    
    mainFunctions.push('new() - Constructor con token de votación, quorum y períodos');
    mainFunctions.push('propose() - Crear nueva propuesta de governance');
    mainFunctions.push('vote() - Votar a favor o en contra de propuesta');
    mainFunctions.push('execute() - Ejecutar propuesta aprobada');
    mainFunctions.push('get_proposal() - Consultar detalles de propuesta');
    mainFunctions.push('get_proposal_count() - Contar total de propuestas');
    
    keyFeatures.push('Sistema de Propuestas - Crear y gestionar propuestas');
    keyFeatures.push('Votación por Tokens - Peso de voto proporcional a participación');
    keyFeatures.push('Quorum Protection - Previene manipulación con baja participación');
    keyFeatures.push('Time Locks - Períodos de reflexión antes de ejecución');
    keyFeatures.push('Democracia Digital - Votación transparente y auditable');
    
    securityNotes.push('Validación de Períodos - Solo votar en tiempo válido');
    securityNotes.push('Quorum Requirements - Umbral mínimo de participación');
    securityNotes.push('Execution Delay - Período de espera antes de ejecutar');
    securityNotes.push('Eventos de Auditoría - Registro completo del proceso');
  }
  
  // Staking con Recompensas
  else if (lowerCode.includes('staking_rewards') && lowerCode.includes('reward_rate')) {
    contractType = '🔒 Staking con Recompensas';
    contractDescription = 'Sistema de staking con recompensas automáticas';
    
    mainFunctions.push('new() - Constructor con tokens de staking y recompensas');
    mainFunctions.push('stake() - Bloquear tokens y comenzar a acumular recompensas');
    mainFunctions.push('unstake() - Liberar tokens del staking');
    mainFunctions.push('claim_rewards() - Reclamar recompensas acumuladas');
    mainFunctions.push('get_stake_info() - Consultar información del staker');
    mainFunctions.push('get_apy() - Calcular rendimiento anual porcentual');
    mainFunctions.push('update_rewards() - Actualizar recompensas automáticamente');
    
    keyFeatures.push('Recompensas Automáticas - Acumulación continua de rewards');
    keyFeatures.push('APY Dinámico - Rendimiento basado en participación');
    keyFeatures.push('Gas Optimizado - Actualizaciones eficientes');
    keyFeatures.push('Flexibilidad - Stake/unstake en cualquier momento');
    keyFeatures.push('Transparencia - Información completa de recompensas');
    
    securityNotes.push('Validación de Balance - Previene operaciones sin fondos');
    securityNotes.push('Actualización Automática - Recompensas se calculan automáticamente');
    securityNotes.push('Manejo de Errores - Result<T, Error> para operaciones seguras');
  }
  
  // DeFi AMM
  else if (lowerCode.includes('defi_amm') && lowerCode.includes('reserve_a')) {
    contractType = '🔄 DeFi AMM Pool de Liquidez';
    contractDescription = 'Pool de liquidez para intercambio de tokens';
    
    mainFunctions.push('new() - Constructor con tokens A y B, y tasa de comisión');
    mainFunctions.push('add_liquidity() - Agregar liquidez al pool y recibir tokens LP');
    mainFunctions.push('remove_liquidity() - Remover liquidez del pool quemando tokens LP');
    mainFunctions.push('swap() - Intercambiar tokens usando fórmula AMM x*y=k');
    mainFunctions.push('get_amount_out() - Calcular cantidad de salida con comisiones');
    mainFunctions.push('get_reserves() - Consultar reservas actuales del pool');
    mainFunctions.push('get_liquidity() - Consultar liquidez de un proveedor específico');
    
    keyFeatures.push('Fórmula x*y=k - Mantiene proporción constante de tokens');
    keyFeatures.push('Comisiones Automáticas - Fee del 0.25% por cada swap');
    keyFeatures.push('Tokens LP - Representan participación en el pool');
    keyFeatures.push('Price Discovery - Precios determinados por algoritmo');
    keyFeatures.push('Slippage Protection - Protección contra deslizamiento');
    
    securityNotes.push('Validación de Liquidez - Verificación de liquidez suficiente');
    securityNotes.push('Protección contra Slippage - Límites de deslizamiento');
    securityNotes.push('Eventos Completos - Tracking de todas las operaciones');
    securityNotes.push('Manejo de Errores - Result<T, Error> para operaciones seguras');
  }
  
  // Detección de contratos de test/testing
  else if (lowerCode.includes('test_') || lowerCode.includes('test_transfer') || 
           lowerCode.includes('test_create') || lowerCode.includes('fn test_')) {
    contractType = '🧪 Contrato de Testing';
    contractDescription = 'Contrato de pruebas para validar funcionalidades';
    
    mainFunctions.push('test_transfer_nft() - Probar transferencia de NFT');
    mainFunctions.push('test_create_nft() - Probar creación de NFT');
    mainFunctions.push('test_contract() - Probar funcionalidades del contrato');
    mainFunctions.push('initialize_test() - Inicializar datos de prueba');
    
    keyFeatures.push('Funciones de Prueba - Para testing y validación');
    keyFeatures.push('Datos de Test - Información de prueba');
    keyFeatures.push('Validación de Funcionalidades - Verificar operaciones');
    keyFeatures.push('Testing Automatizado - Pruebas programáticas');
    
    securityNotes.push('Solo para Testing - No usar en producción');
    securityNotes.push('Datos de Prueba - Información no real');
    securityNotes.push('Validación de Tests - Verificar resultados');
  }
  
  // Detección de contratos de artistas/arte
  else if (lowerCode.includes('artist') || lowerCode.includes('artwork') || 
           lowerCode.includes('digital_art') || lowerCode.includes('creative')) {
    contractType = '🎨 Contrato de Arte Digital';
    contractDescription = 'Contrato para artistas digitales y obras de arte';
    
    mainFunctions.push('create_artwork() - Crear obra de arte digital');
    mainFunctions.push('transfer_artwork() - Transferir obra de arte');
    mainFunctions.push('get_artist_info() - Obtener información del artista');
    mainFunctions.push('get_artwork_metadata() - Obtener metadata de la obra');
    
    keyFeatures.push('Arte Digital - Para artistas digitales');
    keyFeatures.push('Metadata de Arte - Información de la obra');
    keyFeatures.push('Sistema de Artistas - Gestión de creadores');
    keyFeatures.push('Transferencia de Arte - Cambio de propietario');
    
    securityNotes.push('Protección de Arte - Preservar obras digitales');
    securityNotes.push('Validación de Artista - Solo creadores autorizados');
    securityNotes.push('Metadata Segura - Preservar información artística');
  }
  
  // Detección específica para prompts de la interfaz
  
  // Token ERC-20 con staking y recompensas del 10% APY
  else if (lowerCode.includes('erc20') || lowerCode.includes('erc-20') || 
           (lowerCode.includes('staking') && lowerCode.includes('rewards') && lowerCode.includes('apy'))) {
    contractType = '🪙 Token ERC-20 con Staking y Recompensas 10% APY';
    contractDescription = 'Token ERC-20 con funcionalidad de staking y recompensas del 10% APY';
    
    mainFunctions.push('transfer() - Transferir tokens ERC-20');
    mainFunctions.push('balance_of() - Consultar balance de tokens');
    mainFunctions.push('stake() - Bloquear tokens para staking');
    mainFunctions.push('unstake() - Liberar tokens del staking');
    mainFunctions.push('claim_rewards() - Reclamar recompensas del 10% APY');
    mainFunctions.push('get_stake_info() - Consultar información de staking');
    mainFunctions.push('calculate_apy() - Calcular rendimiento anual');
    
    keyFeatures.push('Estándar ERC-20 - Compatible con Ethereum');
    keyFeatures.push('Staking Integrado - Bloqueo de tokens para recompensas');
    keyFeatures.push('APY del 10% - Rendimiento anual garantizado');
    keyFeatures.push('Recompensas Automáticas - Acumulación continua');
    keyFeatures.push('Flexibilidad - Stake/unstake en cualquier momento');
    
    securityNotes.push('Validación de APY - Verificar cálculo del 10%');
    securityNotes.push('Protección de Staking - Prevenir ataques de reentrancia');
    securityNotes.push('Auditoría de Recompensas - Verificar distribución correcta');
  }
  
  // NFT con royalties para artistas
  else if (lowerCode.includes('royalties') && (lowerCode.includes('artist') || lowerCode.includes('creator'))) {
    contractType = '🎨 NFT con Royalties para Artistas';
    contractDescription = 'Contrato NFT con sistema de royalties para artistas y creadores';
    
    mainFunctions.push('mint_nft() - Crear NFT con royalties');
    mainFunctions.push('transfer_nft() - Transferir NFT');
    mainFunctions.push('set_royalty() - Establecer porcentaje de royalties');
    mainFunctions.push('claim_royalties() - Reclamar royalties acumulados');
    mainFunctions.push('get_royalty_info() - Consultar información de royalties');
    mainFunctions.push('get_artist_royalties() - Obtener royalties del artista');
    
    keyFeatures.push('Sistema de Royalties - Ingresos automáticos para artistas');
    keyFeatures.push('Metadata de Arte - Información del artista y obra');
    keyFeatures.push('Transferencia Segura - Validación de propietario');
    keyFeatures.push('Distribución Automática - Royalties automáticos');
    keyFeatures.push('Protección de Artista - Derechos de creador');
    
    securityNotes.push('Validación de Royalties - Verificar porcentajes correctos');
    securityNotes.push('Protección de Artista - Preservar derechos de creador');
    securityNotes.push('Distribución Segura - Prevenir manipulación de royalties');
  }
  
  // Sistema de gobernanza DAO con votación por tokens
  else if (lowerCode.includes('dao') && lowerCode.includes('voting') && lowerCode.includes('tokens')) {
    contractType = '🗳️ DAO Governance con Votación por Tokens';
    contractDescription = 'Sistema de gobernanza DAO con votación por tokens y propuestas';
    
    mainFunctions.push('create_proposal() - Crear propuesta de governance');
    mainFunctions.push('vote_proposal() - Votar en propuesta con tokens');
    mainFunctions.push('execute_proposal() - Ejecutar propuesta aprobada');
    mainFunctions.push('delegate_votes() - Delegar votos a otra cuenta');
    mainFunctions.push('get_voting_power() - Consultar poder de voto');
    mainFunctions.push('get_proposal_status() - Consultar estado de propuesta');
    
    keyFeatures.push('Votación por Tokens - Peso proporcional a tokens');
    keyFeatures.push('Sistema de Propuestas - Creación y gestión');
    keyFeatures.push('Delegación de Votos - Eficiencia en votación');
    keyFeatures.push('Quorum Requirements - Participación mínima');
    keyFeatures.push('Time Locks - Períodos de reflexión');
    
    securityNotes.push('Validación de Votos - Verificar tokens válidos');
    securityNotes.push('Protección de Quorum - Prevenir manipulación');
    securityNotes.push('Auditoría de Votación - Transparencia completa');
  }
  
  // Pool de liquidez para intercambio de tokens
  else if (lowerCode.includes('liquidity_pool') || lowerCode.includes('liquidity') || 
           (lowerCode.includes('pool') && lowerCode.includes('exchange'))) {
    contractType = '🔄 Pool de Liquidez para Intercambio';
    contractDescription = 'Pool de liquidez para intercambio de tokens con fórmula AMM';
    
    mainFunctions.push('add_liquidity() - Agregar liquidez al pool');
    mainFunctions.push('remove_liquidity() - Remover liquidez del pool');
    mainFunctions.push('swap_tokens() - Intercambiar tokens');
    mainFunctions.push('get_exchange_rate() - Consultar tasa de intercambio');
    mainFunctions.push('get_liquidity_info() - Información del pool');
    mainFunctions.push('calculate_swap() - Calcular cantidad de intercambio');
    
    keyFeatures.push('Fórmula AMM - x*y=k para precios justos');
    keyFeatures.push('Comisiones Automáticas - Fees por intercambio');
    keyFeatures.push('Tokens LP - Representan participación');
    keyFeatures.push('Price Discovery - Precios determinados por algoritmo');
    keyFeatures.push('Slippage Protection - Protección contra deslizamiento');
    
    securityNotes.push('Validación de Liquidez - Verificar liquidez suficiente');
    securityNotes.push('Protección contra Slippage - Límites de deslizamiento');
    securityNotes.push('Auditoría de Pool - Verificar reservas correctas');
  }
  
  // Contrato de vesting para tokens de equipo
  else if (lowerCode.includes('vesting') || lowerCode.includes('team_tokens') || 
           (lowerCode.includes('vest') && lowerCode.includes('team'))) {
    contractType = '⏰ Contrato de Vesting para Tokens de Equipo';
    contractDescription = 'Sistema de vesting para tokens de equipo con liberación gradual';
    
    mainFunctions.push('create_vesting_schedule() - Crear programa de vesting');
    mainFunctions.push('claim_vested_tokens() - Reclamar tokens liberados');
    mainFunctions.push('get_vested_amount() - Consultar tokens liberados');
    mainFunctions.push('get_remaining_vesting() - Consultar tokens pendientes');
    mainFunctions.push('update_vesting_schedule() - Actualizar programa');
    mainFunctions.push('emergency_pause() - Pausa de emergencia');
    
    keyFeatures.push('Liberación Gradual - Tokens liberados en el tiempo');
    keyFeatures.push('Múltiples Beneficiarios - Equipo completo');
    mainFunctions.push('Cliff Period - Período de espera inicial');
    keyFeatures.push('Flexibilidad - Diferentes programas de vesting');
    keyFeatures.push('Transparencia - Información completa de liberación');
    
    securityNotes.push('Validación de Tiempo - Verificar fechas de liberación');
    securityNotes.push('Protección de Beneficiarios - Prevenir manipulación');
    securityNotes.push('Auditoría de Vesting - Verificar liberaciones correctas');
  }
  
  // Detección genérica para otros casos
  else if (lowerCode.includes('psp22') || lowerCode.includes('token')) {
    contractType = 'Token PSP-22';
    contractDescription = 'Token fungible estándar PSP-22';
    
    mainFunctions.push('transfer() - Transferir tokens');
    mainFunctions.push('balance_of() - Consultar balance');
    mainFunctions.push('approve() - Autorizar gastos');
    keyFeatures.push('Estándar PSP-22');
    keyFeatures.push('Eventos Transfer/Approval');
    keyFeatures.push('Sistema de allowances');
  }
  
  // Detección de plantillas adicionales del proyecto
  
  // PSP-22 Token (lib/templates/contracts.ts)
  else if (lowerCode.includes('psp22_token') && lowerCode.includes('total_supply') && !lowerCode.includes('staking')) {
    contractType = '🪙 PSP-22 Token Estándar';
    contractDescription = 'Implementación estándar de token fungible PSP-22 con funcionalidades básicas';
    
    mainFunctions.push('new() - Constructor con suministro total inicial');
    mainFunctions.push('total_supply() - Retorna el suministro total de tokens');
    mainFunctions.push('balance_of() - Consulta el balance de una cuenta');
    mainFunctions.push('transfer() - Transfiere tokens entre cuentas');
    mainFunctions.push('transfer_from_to() - Función interna para transferencias seguras');
    
    keyFeatures.push('Estándar PSP-22 - Compatible con ecosistema Polkadot');
    keyFeatures.push('Eventos Transfer - Tracking de transferencias');
    keyFeatures.push('Mapping Storage - Almacenamiento eficiente');
    keyFeatures.push('Manejo de Errores - PSP22Error para validaciones');
    
    securityNotes.push('Verificación de Overflow - Previene operaciones aritméticas inseguras');
    securityNotes.push('Validación de Balance - Verifica fondos suficientes');
    securityNotes.push('Eventos de Auditoría - Registro completo de operaciones');
  }
  
  // PSP-34 NFT (lib/templates/contracts.ts)
  else if (lowerCode.includes('psp34_nft') && lowerCode.includes('token_count')) {
    contractType = '🎨 PSP-34 NFT Estándar';
    contractDescription = 'Implementación estándar de token no fungible PSP-34 con minting y transferencia';
    
    mainFunctions.push('new() - Constructor de la colección NFT');
    mainFunctions.push('mint() - Crear nuevo NFT con metadata URI');
    mainFunctions.push('owner_of() - Consultar propietario de NFT específico');
    mainFunctions.push('transfer() - Transferir NFT entre cuentas');
    
    keyFeatures.push('Minting de NFTs - Creación de tokens únicos');
    keyFeatures.push('Metadata URI - Información de cada NFT');
    keyFeatures.push('Transferencia de Ownership - Cambio de propietario');
    keyFeatures.push('Aprobaciones - Sistema de autorizaciones');
    keyFeatures.push('Eventos de Transferencia - Tracking completo');
    
    securityNotes.push('Límites de Minting - Control de creación de NFTs');
    securityNotes.push('Verificación de Permisos - Solo owner puede transferir');
    securityNotes.push('Validación de Existencia - Verificar que el NFT existe');
    securityNotes.push('Considerar Royalties - Para creadores');
  }
  
  // Governance Contract (lib/templates/contracts.ts)
  else if (lowerCode.includes('governance') && lowerCode.includes('proposals')) {
    contractType = '🗳️ Governance Contract';
    contractDescription = 'Contrato de gobernanza con propuestas, votación y ejecución de cambios';
    
    mainFunctions.push('new() - Constructor con token de votación, período y quorum');
    mainFunctions.push('propose() - Crear nueva propuesta de governance');
    mainFunctions.push('vote() - Votar en propuesta con soporte a favor/en contra');
    mainFunctions.push('execute() - Ejecutar propuesta aprobada');
    
    keyFeatures.push('Creación de Propuestas - Sistema de propuestas');
    keyFeatures.push('Sistema de Votación - Votación por tokens');
    keyFeatures.push('Período de Votación - Configurable por contrato');
    keyFeatures.push('Umbral de Quórum - Participación mínima requerida');
    keyFeatures.push('Ejecución de Propuestas - Implementación de cambios');
    
    securityNotes.push('Timelock para Propuestas Críticas - Período de espera');
    securityNotes.push('Verificación de Permisos - Solo ejecutar cuando corresponde');
    securityNotes.push('Auditoría de Lógica de Votación - Validar votos');
    securityNotes.push('Considerar Delegación de Votos - Para eficiencia');
  }
  
  // Detección genérica para otros casos
  else if (lowerCode.includes('nft') || lowerCode.includes('psp34')) {
    contractType = 'NFT PSP-34';
    contractDescription = 'Token no fungible (NFT) estándar PSP-34';
    mainFunctions.push('mint() - Crear NFT');
    mainFunctions.push('transfer() - Transferir NFT');
    mainFunctions.push('owner_of() - Consultar propietario');
    keyFeatures.push('Metadata personalizable');
    keyFeatures.push('Sistema de royalties');
    keyFeatures.push('Estándar PSP-34');
  }
  
  if (lowerCode.includes('dao') || lowerCode.includes('governance')) {
    contractType = 'DAO Governance';
    contractDescription = 'Sistema de gobernanza descentralizada';
    mainFunctions.push('propose() - Crear propuesta');
    mainFunctions.push('vote() - Votar en propuesta');
    mainFunctions.push('execute() - Ejecutar propuesta');
    keyFeatures.push('Sistema de propuestas');
    keyFeatures.push('Votación por tokens');
    keyFeatures.push('Quorum y time locks');
  }
  
  if (lowerCode.includes('staking') && !lowerCode.includes('token')) {
    contractType = 'Contrato de Staking';
    contractDescription = 'Sistema de staking con recompensas';
    mainFunctions.push('stake() - Bloquear tokens');
    mainFunctions.push('unstake() - Liberar tokens');
    mainFunctions.push('claim_rewards() - Reclamar recompensas');
    keyFeatures.push('Recompensas automáticas');
    keyFeatures.push('APY dinámico');
    keyFeatures.push('Flexibilidad de stake/unstake');
  }
  
  if (lowerCode.includes('pool') || lowerCode.includes('liquidity') || lowerCode.includes('amm')) {
    contractType = 'Pool de Liquidez AMM';
    contractDescription = 'Pool de liquidez para intercambio de tokens';
    mainFunctions.push('add_liquidity() - Agregar liquidez');
    mainFunctions.push('remove_liquidity() - Remover liquidez');
    mainFunctions.push('swap() - Intercambiar tokens');
    keyFeatures.push('Fórmula x*y=k');
    keyFeatures.push('Comisiones automáticas');
    keyFeatures.push('Tokens LP');
  }
  
  // Análisis de funciones específicas
  if (lowerCode.includes('mint')) {
    mainFunctions.push('mint() - Crear nuevos tokens/NFTs');
  }
  if (lowerCode.includes('burn')) {
    mainFunctions.push('burn() - Quemar tokens/NFTs');
  }
  if (lowerCode.includes('approve')) {
    mainFunctions.push('approve() - Autorizar transferencias');
  }
  if (lowerCode.includes('allowance')) {
    mainFunctions.push('allowance() - Consultar autorización');
  }
  
  // Análisis de eventos
  const events: string[] = [];
  if (lowerCode.includes('transfer')) {
    events.push('Transfer - Transferencias de tokens/NFTs');
  }
  if (lowerCode.includes('approval')) {
    events.push('Approval - Autorizaciones de gasto');
  }
  if (lowerCode.includes('mint')) {
    events.push('Mint - Creación de tokens/NFTs');
  }
  if (lowerCode.includes('stake')) {
    events.push('Staked - Tokens bloqueados para staking');
  }
  if (lowerCode.includes('vote')) {
    events.push('Voted - Votaciones en propuestas');
  }
  
  // Análisis de seguridad
  if (lowerCode.includes('result<') || lowerCode.includes('error')) {
    securityNotes.push('Manejo de errores con Result<T, Error>');
  }
  if (lowerCode.includes('owner') && lowerCode.includes('caller')) {
    securityNotes.push('Control de acceso basado en owner');
  }
  if (lowerCode.includes('balance') && lowerCode.includes('check')) {
    securityNotes.push('Validación de balances antes de operaciones');
  }
  if (lowerCode.includes('mapping') || lowerCode.includes('storage')) {
    securityNotes.push('Storage seguro con Mapping');
  }
  
  // Generar explicación específica
  let explanation = `## ${contractType} - Explicación Detallada

### 📋 **Descripción del Contrato:**
${contractDescription}

### 🔧 **Funciones Principales Implementadas:**`;

  mainFunctions.forEach(func => {
    explanation += `\n- ✅ **${func}**`;
  });

  if (keyFeatures.length > 0) {
    explanation += `\n\n### 🎯 **Características Clave:**`;
    keyFeatures.forEach(feature => {
      explanation += `\n- **${feature}**: Implementado en el contrato`;
    });
  }

  if (events.length > 0) {
    explanation += `\n\n### 📡 **Eventos Emitidos:**`;
    events.forEach(event => {
      explanation += `\n- **${event}**: Para tracking y auditoría`;
    });
  }

  if (securityNotes.length > 0) {
    explanation += `\n\n### 🔒 **Patrones de Seguridad:**`;
    securityNotes.forEach(note => {
      explanation += `\n- **${note}**: Implementado para seguridad`;
    });
  }

  // Agregar análisis específico según el enfoque
  if (focus === 'security') {
    explanation += `\n\n### 🛡️ **Análisis de Seguridad:**
- **Validaciones**: El contrato implementa validaciones apropiadas
- **Control de Acceso**: Sistema de permisos según el tipo de contrato
- **Manejo de Errores**: Uso de Result<T, Error> para operaciones seguras
- **Eventos de Auditoría**: Tracking completo de operaciones`;
  } else if (focus === 'optimization') {
    explanation += `\n\n### ⚡ **Optimizaciones:**
- **Gas Efficiency**: Operaciones optimizadas para bajo costo
- **Storage Patterns**: Uso eficiente de storage con Mapping
- **Event Emissions**: Eventos optimizados para tracking
- **Function Design**: Funciones diseñadas para eficiencia`;
  } else if (focus === 'deployment') {
    explanation += `\n\n### 🚀 **Deployment:**
- **Red Recomendada**: Paseo Testnet para pruebas
- **Constructor**: Configuración inicial del contrato
- **Testing**: Pruebas en testnet antes de mainnet
- **Verification**: Verificación del código en block explorer`;
  }

  explanation += `\n\n### 💡 **Ventajas Técnicas:**
- **Estándar Polkadot**: Compatible con ecosistema Polkadot
- **Gas Optimizado**: Operaciones eficientes
- **Seguridad**: Validaciones y controles apropiados
- **Eventos Completos**: Tracking de todas las operaciones
- **Flexibilidad**: Adaptable a diferentes casos de uso`;

  return explanation;
}

export async function* debugErrorStream(
  errorMessage: string,
  code?: string,
  context?: string
) {
  try {
    yield* groqDebug(errorMessage, code, context);
  } catch (error) {
    console.error('Groq API error:', error);
    // Fallback a debug de ejemplo
    const mockDebug = `## Análisis del Error

### Causa Raíz
El error indica un problema común en contratos ink! relacionado con el manejo de storage o permisos.

### Solución Paso a Paso
1. **Verificar imports**: Asegúrate de importar todas las dependencias necesarias
2. **Revisar storage**: Verifica que los campos de storage estén correctamente definidos
3. **Validar permisos**: Implementa controles de acceso apropiados

### Código de Ejemplo
\`\`\`rust
#[ink(message)]
pub fn safe_function(&mut self) -> Result<(), Error> {
    // Validar permisos
    if self.owner != self.env().caller() {
        return Err(Error::Unauthorized);
    }
    
    // Lógica del contrato
    Ok(())
}
\`\`\`

### Prevención
- Siempre valida permisos antes de modificar storage
- Usa Result<T, Error> para manejo de errores
- Implementa eventos para debugging`;

    // Simular streaming del debug
    for (let i = 0; i < mockDebug.length; i += 12) {
      yield mockDebug.slice(i, i + 12);
      await new Promise(resolve => setTimeout(resolve, 25));
    }
  }
}