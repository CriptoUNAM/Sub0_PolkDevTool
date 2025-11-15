#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// Arkiv Data Storage Contract
/// 
/// Este contrato integra con Arkiv SDK para almacenar metadata
/// de contratos off-chain, demostrando el uso de Arkiv en Polkadot.
/// 
/// Generado con Polkadot DevKit para sub0 Hackathon 2025
#[ink::contract]
mod arkiv_storage {
    use ink::storage::Mapping;
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;

    /// Storage del contrato
    #[ink(storage)]
    pub struct ArkivStorage {
        /// Registro de contratos
        contracts: Mapping<AccountId, ContractInfo>,
        /// Lista de contratos registrados
        contract_list: Vec<AccountId>,
        /// Contador de contratos
        contract_count: u32,
        /// Dirección del contrato Arkiv (off-chain)
        arkiv_address: Option<String>,
    }

    /// Información de un contrato
    #[derive(Debug, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct ContractInfo {
        /// Dirección del contrato
        contract_address: AccountId,
        /// Nombre del contrato
        name: String,
        /// Descripción
        description: String,
        /// Tags
        tags: Vec<String>,
        /// Categoría
        category: String,
        /// Complejidad
        complexity: String,
        /// Timestamp de creación
        created_at: u64,
        /// ID en Arkiv (off-chain)
        arkiv_id: Option<String>,
        /// TTL en Arkiv (segundos)
        ttl: Option<u64>,
    }

    /// Eventos del contrato
    #[ink(event)]
    pub struct ContractRegistered {
        #[ink(topic)]
        contract_address: AccountId,
        #[ink(topic)]
        name: String,
        arkiv_id: Option<String>,
    }

    #[ink(event)]
    pub struct ContractUpdated {
        #[ink(topic)]
        contract_address: AccountId,
        arkiv_id: Option<String>,
    }

    #[ink(event)]
    pub struct ArkivAddressSet {
        #[ink(topic)]
        arkiv_address: String,
    }

    impl ArkivStorage {
        /// Constructor del contrato
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                contracts: Mapping::default(),
                contract_list: Vec::new(),
                contract_count: 0,
                arkiv_address: None,
            }
        }

        /// Registrar un nuevo contrato
        #[ink(message)]
        pub fn register_contract(
            &mut self,
            contract_address: AccountId,
            name: String,
            description: String,
            tags: Vec<String>,
            category: String,
            complexity: String,
            ttl: Option<u64>,
        ) -> Result<(), Error> {
            let caller = Self::env().caller();

            if self.contracts.get(contract_address).is_some() {
                return Err(Error::ContractAlreadyRegistered);
            }

            let contract_info = ContractInfo {
                contract_address,
                name: name.clone(),
                description,
                tags,
                category,
                complexity,
                created_at: Self::env().block_timestamp(),
                arkiv_id: None, // Se establecerá off-chain
                ttl,
            };

            self.contracts.insert(contract_address, &contract_info);
            self.contract_list.push(contract_address);
            self.contract_count += 1;

            // El arkiv_id se establecerá off-chain mediante el frontend
            // que usa el Arkiv SDK

            Self::env().emit_event(ContractRegistered {
                contract_address,
                name,
                arkiv_id: None,
            });

            Ok(())
        }

        /// Actualizar información de un contrato
        #[ink(message)]
        pub fn update_contract(
            &mut self,
            contract_address: AccountId,
            name: Option<String>,
            description: Option<String>,
            tags: Option<Vec<String>>,
            arkiv_id: Option<String>,
        ) -> Result<(), Error> {
            let caller = Self::env().caller();
            let mut contract_info = self.contracts.get(contract_address)
                .ok_or(Error::ContractNotFound)?;

            if let Some(new_name) = name {
                contract_info.name = new_name;
            }

            if let Some(new_description) = description {
                contract_info.description = new_description;
            }

            if let Some(new_tags) = tags {
                contract_info.tags = new_tags;
            }

            if let Some(new_arkiv_id) = arkiv_id {
                contract_info.arkiv_id = Some(new_arkiv_id);
            }

            self.contracts.insert(contract_address, &contract_info);

            Self::env().emit_event(ContractUpdated {
                contract_address,
                arkiv_id: contract_info.arkiv_id.clone(),
            });

            Ok(())
        }

        /// Establecer dirección de Arkiv (off-chain)
        #[ink(message)]
        pub fn set_arkiv_address(&mut self, arkiv_address: String) -> Result<(), Error> {
            let caller = Self::env().caller();
            self.arkiv_address = Some(arkiv_address.clone());

            Self::env().emit_event(ArkivAddressSet {
                arkiv_address,
            });

            Ok(())
        }

        /// Obtener información de un contrato
        #[ink(message)]
        pub fn get_contract(&self, contract_address: AccountId) -> Option<ContractInfo> {
            self.contracts.get(contract_address)
        }

        /// Obtener lista de contratos registrados
        #[ink(message)]
        pub fn get_contract_list(&self) -> Vec<AccountId> {
            self.contract_list.clone()
        }

        /// Obtener contador de contratos
        #[ink(message)]
        pub fn get_contract_count(&self) -> u32 {
            self.contract_count
        }

        /// Obtener dirección de Arkiv
        #[ink(message)]
        pub fn get_arkiv_address(&self) -> Option<String> {
            self.arkiv_address.clone()
        }

        /// Buscar contratos por tag
        #[ink(message)]
        pub fn search_by_tag(&self, tag: String) -> Vec<AccountId> {
            let mut results = Vec::new();
            for contract_address in &self.contract_list {
                if let Some(contract_info) = self.contracts.get(*contract_address) {
                    if contract_info.tags.contains(&tag) {
                        results.push(*contract_address);
                    }
                }
            }
            results
        }

        /// Buscar contratos por categoría
        #[ink(message)]
        pub fn search_by_category(&self, category: String) -> Vec<AccountId> {
            let mut results = Vec::new();
            for contract_address in &self.contract_list {
                if let Some(contract_info) = self.contracts.get(*contract_address) {
                    if contract_info.category == category {
                        results.push(*contract_address);
                    }
                }
            }
            results
        }
    }

    /// Errores del contrato
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        ContractAlreadyRegistered,
        ContractNotFound,
        InvalidArkivAddress,
    }
}

