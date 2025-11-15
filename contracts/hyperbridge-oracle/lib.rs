#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// Hyperbridge Cross-Chain Oracle
/// 
/// Este contrato usa Hyperbridge SDK para consultar datos cross-chain,
/// demostrando interoperabilidad entre Polkadot y otras blockchains.
/// 
/// Generado con Polkadot DevKit para sub0 Hackathon 2025
#[ink::contract]
mod hyperbridge_oracle {
    use ink::storage::Mapping;
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;

    /// Storage del contrato
    #[ink(storage)]
    pub struct HyperbridgeOracle {
        /// Precios almacenados
        prices: Mapping<String, PriceData>,
        /// Balances cross-chain
        balances: Mapping<(String, AccountId), Balance>,
        /// Validadores de datos
        validators: Vec<AccountId>,
        /// Umbral de validadores requeridos
        required_validators: u32,
        /// Dirección del contrato Hyperbridge (off-chain)
        hyperbridge_address: Option<String>,
    }

    /// Datos de precio
    #[derive(Debug, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct PriceData {
        /// Precio
        price: u128,
        /// Timestamp
        timestamp: u64,
        /// Chain de origen
        source_chain: String,
        /// Contrato de origen
        source_contract: String,
        /// Número de validadores
        validator_count: u32,
        /// Verificado
        verified: bool,
    }

    /// Eventos del contrato
    #[ink(event)]
    pub struct PriceUpdated {
        #[ink(topic)]
        symbol: String,
        price: u128,
        #[ink(topic)]
        source_chain: String,
        verified: bool,
    }

    #[ink(event)]
    pub struct BalanceUpdated {
        #[ink(topic)]
        chain: String,
        #[ink(topic)]
        account: AccountId,
        balance: Balance,
    }

    #[ink(event)]
    pub struct ValidatorAdded {
        #[ink(topic)]
        validator: AccountId,
    }

    #[ink(event)]
    pub struct HyperbridgeAddressSet {
        #[ink(topic)]
        hyperbridge_address: String,
    }

    impl HyperbridgeOracle {
        /// Constructor del contrato
        #[ink(constructor)]
        pub fn new(required_validators: u32) -> Self {
            Self {
                prices: Mapping::default(),
                balances: Mapping::default(),
                validators: Vec::new(),
                required_validators,
                hyperbridge_address: None,
            }
        }

        /// Agregar un validador
        #[ink(message)]
        pub fn add_validator(&mut self, validator: AccountId) -> Result<(), Error> {
            let caller = Self::env().caller();

            // Solo el owner puede agregar validadores (simplificado)
            // En producción, usar sistema de gobernanza

            if self.validators.contains(&validator) {
                return Err(Error::ValidatorExists);
            }

            self.validators.push(validator);

            Self::env().emit_event(ValidatorAdded {
                validator,
            });

            Ok(())
        }

        /// Actualizar precio desde otra chain (off-chain)
        /// El frontend usa Hyperbridge SDK para obtener el precio
        /// y luego llama a esta función para actualizarlo on-chain
        #[ink(message)]
        pub fn update_price(
            &mut self,
            symbol: String,
            price: u128,
            source_chain: String,
            source_contract: String,
            verified: bool,
        ) -> Result<(), Error> {
            let caller = Self::env().caller();

            // Verificar que el caller es un validador
            if !self.validators.contains(&caller) {
                return Err(Error::NotValidator);
            }

            let price_data = PriceData {
                price,
                timestamp: Self::env().block_timestamp(),
                source_chain: source_chain.clone(),
                source_contract,
                validator_count: 1,
                verified,
            };

            self.prices.insert(symbol.clone(), &price_data);

            Self::env().emit_event(PriceUpdated {
                symbol,
                price,
                source_chain,
                verified,
            });

            Ok(())
        }

        /// Actualizar balance desde otra chain (off-chain)
        /// El frontend usa Hyperbridge SDK para obtener el balance
        /// y luego llama a esta función para actualizarlo on-chain
        #[ink(message)]
        pub fn update_balance(
            &mut self,
            chain: String,
            account: AccountId,
            balance: Balance,
        ) -> Result<(), Error> {
            let caller = Self::env().caller();

            // Verificar que el caller es un validador
            if !self.validators.contains(&caller) {
                return Err(Error::NotValidator);
            }

            self.balances.insert((chain.clone(), account), &balance);

            Self::env().emit_event(BalanceUpdated {
                chain,
                account,
                balance,
            });

            Ok(())
        }

        /// Establecer dirección de Hyperbridge (off-chain)
        #[ink(message)]
        pub fn set_hyperbridge_address(&mut self, hyperbridge_address: String) -> Result<(), Error> {
            let caller = Self::env().caller();
            self.hyperbridge_address = Some(hyperbridge_address.clone());

            Self::env().emit_event(HyperbridgeAddressSet {
                hyperbridge_address,
            });

            Ok(())
        }

        /// Obtener precio de un símbolo
        #[ink(message)]
        pub fn get_price(&self, symbol: String) -> Option<PriceData> {
            self.prices.get(symbol)
        }

        /// Obtener balance cross-chain
        #[ink(message)]
        pub fn get_balance(&self, chain: String, account: AccountId) -> Option<Balance> {
            self.balances.get((chain, account))
        }

        /// Obtener lista de validadores
        #[ink(message)]
        pub fn get_validators(&self) -> Vec<AccountId> {
            self.validators.clone()
        }

        /// Obtener dirección de Hyperbridge
        #[ink(message)]
        pub fn get_hyperbridge_address(&self) -> Option<String> {
            self.hyperbridge_address.clone()
        }

        /// Verificar precio con múltiples validadores
        #[ink(message)]
        pub fn verify_price(
            &mut self,
            symbol: String,
            price: u128,
            source_chain: String,
            source_contract: String,
        ) -> Result<bool, Error> {
            // En producción, agregar lógica de verificación
            // con múltiples validadores y consenso

            let price_data = PriceData {
                price,
                timestamp: Self::env().block_timestamp(),
                source_chain: source_chain.clone(),
                source_contract,
                validator_count: self.validators.len() as u32,
                verified: self.validators.len() >= self.required_validators as usize,
            };

            self.prices.insert(symbol.clone(), &price_data);

            Self::env().emit_event(PriceUpdated {
                symbol,
                price,
                source_chain,
                verified: price_data.verified,
            });

            Ok(price_data.verified)
        }
    }

    /// Errores del contrato
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        ValidatorExists,
        NotValidator,
        InvalidPrice,
        InvalidChain,
    }
}

