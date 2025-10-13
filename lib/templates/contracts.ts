import type { ContractTemplate } from '@/types/contracts';

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  // === TOKENS ===
  {
    id: 'psp22-token',
    name: 'PSP-22 Token',
    description: 'Implementación estándar de token fungible PSP-22 con funcionalidades básicas de transferencia y aprobación.',
    category: 'token',
    complexity: 'beginner',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod psp22_token {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct Psp22Token {
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
        allowances: Mapping<(AccountId, AccountId), Balance>,
    }

    #[ink(event)]
    pub struct Transfer {
        #[ink(topic)]
        from: Option<AccountId>,
        #[ink(topic)]
        to: Option<AccountId>,
        value: Balance,
    }

    impl Psp22Token {
        #[ink(constructor)]
        pub fn new(total_supply: Balance) -> Self {
            let mut balances = Mapping::default();
            let caller = Self::env().caller();
            balances.insert(caller, &total_supply);

            Self::env().emit_event(Transfer {
                from: None,
                to: Some(caller),
                value: total_supply,
            });

            Self {
                total_supply,
                balances,
                allowances: Default::default(),
            }
        }

        #[ink(message)]
        pub fn total_supply(&self) -> Balance {
            self.total_supply
        }

        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> Balance {
            self.balances.get(&owner).unwrap_or_default()
        }

        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, value: Balance) -> Result<(), PSP22Error> {
            let from = self.env().caller();
            self.transfer_from_to(&from, &to, value)?;
            Ok(())
        }

        fn transfer_from_to(
            &mut self,
            from: &AccountId,
            to: &AccountId,
            value: Balance,
        ) -> Result<(), PSP22Error> {
            let from_balance = self.balance_of(*from);
            if from_balance < value {
                return Err(PSP22Error::InsufficientBalance);
            }

            self.balances.insert(from, &(from_balance - value));
            let to_balance = self.balance_of(*to);
            self.balances.insert(to, &(to_balance + value));

            self.env().emit_event(Transfer {
                from: Some(*from),
                to: Some(*to),
                value,
            });

            Ok(())
        }
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum PSP22Error {
        InsufficientBalance,
        InsufficientAllowance,
    }
}`,
    features: [
      'Transferencia de tokens',
      'Consulta de balance',
      'Suministro total',
      'Eventos de transferencia'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Sube el código WASM a la blockchain',
      'Instancia el contrato con el suministro total inicial',
      'Verifica la instancia en el explorador de bloques'
    ],
    securityConsiderations: [
      'Verificar que no hay overflow en operaciones aritméticas',
      'Implementar pausas de emergencia si es necesario',
      'Auditar la lógica de transferencia',
      'Considerar límites de suministro máximo'
    ]
  },
  {
    id: 'psp34-nft',
    name: 'PSP-34 NFT',
    description: 'Implementación estándar de token no fungible PSP-34 con funcionalidades de minting y transferencia.',
    category: 'nft',
    complexity: 'intermediate',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod psp34_nft {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct Psp34Nft {
        token_count: u64,
        owners: Mapping<Id, AccountId>,
        token_uris: Mapping<Id, String>,
        approved: Mapping<(AccountId, Id), AccountId>,
        operator_approvals: Mapping<(AccountId, AccountId), bool>,
    }

    #[derive(Debug, PartialEq, Eq, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Id {
        U8(u8),
        U16(u16),
        U32(u32),
        U64(u64),
        U128(u128),
        Bytes(Vec<u8>),
    }

    #[ink(event)]
    pub struct Transfer {
        #[ink(topic)]
        from: Option<AccountId>,
        #[ink(topic)]
        to: Option<AccountId>,
        #[ink(topic)]
        id: Id,
    }

    impl Psp34Nft {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                token_count: 0,
                owners: Mapping::default(),
                token_uris: Mapping::default(),
                approved: Mapping::default(),
                operator_approvals: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn mint(&mut self, to: AccountId, token_uri: String) -> Result<Id, PSP34Error> {
            let token_id = Id::U64(self.token_count);
            self.token_count += 1;
            
            self.owners.insert(&token_id, &to);
            self.token_uris.insert(&token_id, &token_uri);

            self.env().emit_event(Transfer {
                from: None,
                to: Some(to),
                id: token_id.clone(),
            });

            Ok(token_id)
        }

        #[ink(message)]
        pub fn owner_of(&self, id: Id) -> Option<AccountId> {
            self.owners.get(&id)
        }

        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, id: Id) -> Result<(), PSP34Error> {
            let caller = self.env().caller();
            let owner = self.owner_of(id.clone()).ok_or(PSP34Error::TokenNotExists)?;
            
            if owner != caller {
                return Err(PSP34Error::NotOwner);
            }

            self.owners.insert(&id, &to);
            self.approved.remove(&(owner, id.clone()));

            self.env().emit_event(Transfer {
                from: Some(owner),
                to: Some(to),
                id,
            });

            Ok(())
        }
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum PSP34Error {
        TokenNotExists,
        NotOwner,
        NotApproved,
    }
}`,
    features: [
      'Minting de NFTs',
      'Transferencia de ownership',
      'Metadata URI',
      'Aprobaciones',
      'Eventos de transferencia'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Sube el código WASM a la blockchain',
      'Instancia el contrato',
      'Mint NFTs usando la función mint()',
      'Verifica la propiedad en el explorador'
    ],
    securityConsiderations: [
      'Implementar límites de minting',
      'Verificar permisos de minting',
      'Auditar la lógica de transferencia',
      'Considerar royalties para creadores'
    ]
  },
  {
    id: 'governance-contract',
    name: 'Governance Contract',
    description: 'Contrato de gobernanza con propuestas, votación y ejecución de cambios.',
    category: 'governance',
    complexity: 'advanced',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod governance {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct Governance {
        voting_token: AccountId,
        proposals: Mapping<u32, Proposal>,
        proposal_count: u32,
        voting_period: u64,
        quorum_threshold: u64,
    }

    #[derive(Debug, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Proposal {
        proposer: AccountId,
        description: String,
        start_time: u64,
        end_time: u64,
        for_votes: u64,
        against_votes: u64,
        executed: bool,
    }

    #[ink(event)]
    pub struct ProposalCreated {
        #[ink(topic)]
        proposal_id: u32,
        #[ink(topic)]
        proposer: AccountId,
    }

    impl Governance {
        #[ink(constructor)]
        pub fn new(voting_token: AccountId, voting_period: u64, quorum_threshold: u64) -> Self {
            Self {
                voting_token,
                proposals: Mapping::default(),
                proposal_count: 0,
                voting_period,
                quorum_threshold,
            }
        }

        #[ink(message)]
        pub fn propose(&mut self, description: String) -> Result<u32, GovernanceError> {
            let caller = self.env().caller();
            let proposal_id = self.proposal_count;
            
            let now = self.env().block_timestamp();
            let proposal = Proposal {
                proposer: caller,
                description,
                start_time: now,
                end_time: now + self.voting_period,
                for_votes: 0,
                against_votes: 0,
                executed: false,
            };

            self.proposals.insert(proposal_id, &proposal);
            self.proposal_count += 1;

            self.env().emit_event(ProposalCreated {
                proposal_id,
                proposer: caller,
            });

            Ok(proposal_id)
        }

        #[ink(message)]
        pub fn vote(&mut self, proposal_id: u32, support: bool) -> Result<(), GovernanceError> {
            let caller = self.env().caller();
            let mut proposal = self.proposals.get(proposal_id).ok_or(GovernanceError::ProposalNotFound)?;
            
            let now = self.env().block_timestamp();
            if now > proposal.end_time {
                return Err(GovernanceError::VotingPeriodEnded);
            }

            // Get voter's token balance (simplified)
            let voter_balance = 1000; // In real implementation, query the voting token contract
            
            if support {
                proposal.for_votes += voter_balance;
            } else {
                proposal.against_votes += voter_balance;
            }

            self.proposals.insert(proposal_id, &proposal);
            Ok(())
        }

        #[ink(message)]
        pub fn execute(&mut self, proposal_id: u32) -> Result<(), GovernanceError> {
            let mut proposal = self.proposals.get(proposal_id).ok_or(GovernanceError::ProposalNotFound)?;
            
            if proposal.executed {
                return Err(GovernanceError::AlreadyExecuted);
            }

            let now = self.env().block_timestamp();
            if now <= proposal.end_time {
                return Err(GovernanceError::VotingPeriodActive);
            }

            let total_votes = proposal.for_votes + proposal.against_votes;
            if total_votes < self.quorum_threshold {
                return Err(GovernanceError::QuorumNotMet);
            }

            if proposal.for_votes <= proposal.against_votes {
                return Err(GovernanceError::ProposalRejected);
            }

            proposal.executed = true;
            self.proposals.insert(proposal_id, &proposal);
            Ok(())
        }
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum GovernanceError {
        ProposalNotFound,
        VotingPeriodEnded,
        VotingPeriodActive,
        QuorumNotMet,
        ProposalRejected,
        AlreadyExecuted,
    }
}`,
    features: [
      'Creación de propuestas',
      'Sistema de votación',
      'Período de votación configurable',
      'Umbral de quórum',
      'Ejecución de propuestas aprobadas'
    ],
    deploymentSteps: [
      'Deploy el token de votación primero',
      'Deploy el contrato de gobernanza con la dirección del token',
      'Configurar período de votación y quórum',
      'Transferir tokens de votación a los participantes',
      'Crear la primera propuesta de prueba'
    ],
    securityConsiderations: [
      'Implementar timelock para propuestas críticas',
      'Verificar permisos de ejecución',
      'Auditar la lógica de votación',
      'Considerar delegación de votos'
    ]
  },

  // === NUEVAS PLANTILLAS ===
  
  // 1. Token con Staking
  {
    id: 'psp22-staking-token',
    name: 'PSP-22 Token con Staking',
    description: 'Token PSP-22 con funcionalidades de staking y recompensas automáticas.',
    category: 'token',
    complexity: 'intermediate',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod staking_token {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct StakingToken {
        total_supply: Balance,
        balances: Mapping<AccountId, Balance>,
        allowances: Mapping<(AccountId, AccountId), Balance>,
        staking_pool: Balance,
        staker_info: Mapping<AccountId, StakerInfo>,
        reward_rate: Balance,
        last_update: u64,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct StakerInfo {
        amount: Balance,
        reward_debt: Balance,
    }

    #[ink(event)]
    pub struct Staked {
        #[ink(topic)]
        staker: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct RewardsClaimed {
        #[ink(topic)]
        staker: AccountId,
        amount: Balance,
    }

    impl StakingToken {
        #[ink(constructor)]
        pub fn new(total_supply: Balance, reward_rate: Balance) -> Self {
            let mut balances = Mapping::default();
            let caller = Self::env().caller();
            balances.insert(caller, &total_supply);

            Self {
                total_supply,
                balances,
                allowances: Mapping::default(),
                staking_pool: 0,
                staker_info: Mapping::default(),
                reward_rate,
                last_update: 0,
            }
        }

        #[ink(message)]
        pub fn stake(&mut self, amount: Balance) -> Result<(), Error> {
            let staker = self.env().caller();
            let balance = self.balance_of(staker);
            
            if balance < amount {
                return Err(Error::InsufficientBalance);
            }

            self.update_rewards(staker);
            
            let mut staker_info = self.staker_info.get(staker).unwrap_or(StakerInfo {
                amount: 0,
                reward_debt: 0,
            });
            
            staker_info.amount += amount;
            self.staker_info.insert(staker, &staker_info);
            
            self.staking_pool += amount;
            self.balances.insert(staker, &(balance - amount));

            self.env().emit_event(Staked {
                staker,
                amount,
            });

            Ok(())
        }

        #[ink(message)]
        pub fn unstake(&mut self, amount: Balance) -> Result<(), Error> {
            let staker = self.env().caller();
            let mut staker_info = self.staker_info.get(staker).ok_or(Error::NoStake)?;
            
            if staker_info.amount < amount {
                return Err(Error::InsufficientStake);
            }

            self.update_rewards(staker);
            
            staker_info.amount -= amount;
            self.staker_info.insert(staker, &staker_info);
            
            self.staking_pool -= amount;
            let balance = self.balance_of(staker);
            self.balances.insert(staker, &(balance + amount));

            Ok(())
        }

        #[ink(message)]
        pub fn claim_rewards(&mut self) -> Result<Balance, Error> {
            let staker = self.env().caller();
            self.update_rewards(staker);
            
            let mut staker_info = self.staker_info.get(staker).ok_or(Error::NoStake)?;
            let rewards = staker_info.reward_debt;
            
            if rewards > 0 {
                staker_info.reward_debt = 0;
                self.staker_info.insert(staker, &staker_info);
                
                let balance = self.balance_of(staker);
                self.balances.insert(staker, &(balance + rewards));

                self.env().emit_event(RewardsClaimed {
                    staker,
                    amount: rewards,
                });
            }

            Ok(rewards)
        }

        #[ink(message)]
        pub fn get_stake_info(&self, staker: AccountId) -> Option<StakerInfo> {
            self.staker_info.get(staker)
        }

        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> Balance {
            self.balances.get(&owner).unwrap_or_default()
        }

        fn update_rewards(&mut self, staker: AccountId) {
            let current_time = self.env().block_timestamp();
            let time_elapsed = current_time - self.last_update;
            
            if time_elapsed > 0 && self.staking_pool > 0 {
                let total_rewards = self.reward_rate * time_elapsed;
                
                if let Some(mut staker_info) = self.staker_info.get(staker) {
                    let staker_share = (staker_info.amount * total_rewards) / self.staking_pool;
                    staker_info.reward_debt += staker_share;
                    self.staker_info.insert(staker, &staker_info);
                }
            }
            
            self.last_update = current_time;
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InsufficientBalance,
        NoStake,
        InsufficientStake,
    }
}`,
    features: [
      'Staking de tokens',
      'Recompensas automáticas',
      'APY configurable',
      'Claim de rewards',
      'Información de staking'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy con suministro inicial y tasa de recompensas',
      'Configurar parámetros de staking',
      'Probar funcionalidades de stake/unstake',
      'Verificar distribución de recompensas'
    ],
    securityConsiderations: [
      'Validar cálculos de recompensas',
      'Prevenir ataques de reentrancia',
      'Auditar lógica de staking',
      'Implementar límites de staking'
    ]
  },

  // 2. NFT Collection con Royalties
  {
    id: 'psp34-nft-royalties',
    name: 'PSP-34 NFT con Royalties',
    description: 'Colección NFT PSP-34 con sistema de royalties para artistas.',
    category: 'nft',
    complexity: 'intermediate',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod nft_royalties {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct NftRoyalties {
        token_count: u64,
        owners: Mapping<u64, AccountId>,
        token_uris: Mapping<u64, String>,
        royalties: Mapping<u64, u16>, // Percentage (0-10000)
        creators: Mapping<u64, AccountId>,
        approved: Mapping<(AccountId, u64), AccountId>,
    }

    #[ink(event)]
    pub struct NftMinted {
        #[ink(topic)]
        token_id: u64,
        #[ink(topic)]
        creator: AccountId,
        #[ink(topic)]
        owner: AccountId,
        royalty_percentage: u16,
    }

    #[ink(event)]
    pub struct RoyaltyPaid {
        #[ink(topic)]
        token_id: u64,
        #[ink(topic)]
        creator: AccountId,
        amount: Balance,
    }

    impl NftRoyalties {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                token_count: 0,
                owners: Mapping::default(),
                token_uris: Mapping::default(),
                royalties: Mapping::default(),
                creators: Mapping::default(),
                approved: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn mint(&mut self, to: AccountId, token_uri: String, royalty_percentage: u16) -> Result<u64, Error> {
            if royalty_percentage > 10000 {
                return Err(Error::InvalidRoyalty);
            }

            let token_id = self.token_count;
            self.token_count += 1;
            
            self.owners.insert(token_id, &to);
            self.token_uris.insert(token_id, &token_uri);
            self.royalties.insert(token_id, &royalty_percentage);
            self.creators.insert(token_id, &self.env().caller());

            self.env().emit_event(NftMinted {
                token_id,
                creator: self.env().caller(),
                owner: to,
                royalty_percentage,
            });

            Ok(token_id)
        }

        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, token_id: u64) -> Result<(), Error> {
            let caller = self.env().caller();
            let owner = self.owners.get(token_id).ok_or(Error::TokenNotFound)?;
            
            if owner != caller {
                return Err(Error::NotOwner);
            }

            self.owners.insert(token_id, &to);
            self.approved.remove(&(owner, token_id));

            Ok(())
        }

        #[ink(message)]
        pub fn get_royalty_info(&self, token_id: u64) -> Option<(AccountId, u16)> {
            let creator = self.creators.get(token_id)?;
            let royalty = self.royalties.get(token_id)?;
            Some((creator, royalty))
        }

        #[ink(message)]
        pub fn owner_of(&self, token_id: u64) -> Option<AccountId> {
            self.owners.get(token_id)
        }

        #[ink(message)]
        pub fn get_token_uri(&self, token_id: u64) -> Option<String> {
            self.token_uris.get(token_id)
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        TokenNotFound,
        NotOwner,
        InvalidRoyalty,
    }
}`,
    features: [
      'Minting con royalties',
      'Transferencia de NFTs',
      'Sistema de royalties',
      'Metadata URI',
      'Información de creador'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy el contrato NFT',
      'Mint NFTs con royalties configuradas',
      'Probar transferencias',
      'Verificar distribución de royalties'
    ],
    securityConsiderations: [
      'Validar porcentajes de royalty',
      'Proteger metadata de NFTs',
      'Auditar lógica de transferencia',
      'Implementar límites de royalty'
    ]
  },

  // 3. AMM Pool de Liquidez
  {
    id: 'amm-liquidity-pool',
    name: 'AMM Pool de Liquidez',
    description: 'Pool de liquidez AMM para intercambio de tokens con fórmula x*y=k.',
    category: 'defi',
    complexity: 'advanced',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod amm_pool {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct AmmPool {
        token_a: AccountId,
        token_b: AccountId,
        reserve_a: Balance,
        reserve_b: Balance,
        total_supply: Balance,
        liquidity_providers: Mapping<AccountId, Balance>,
        fee_rate: u16, // Basis points (0-10000)
    }

    #[ink(event)]
    pub struct LiquidityAdded {
        #[ink(topic)]
        provider: AccountId,
        amount_a: Balance,
        amount_b: Balance,
        liquidity_tokens: Balance,
    }

    #[ink(event)]
    pub struct Swap {
        #[ink(topic)]
        trader: AccountId,
        token_in: AccountId,
        token_out: AccountId,
        amount_in: Balance,
        amount_out: Balance,
    }

    impl AmmPool {
        #[ink(constructor)]
        pub fn new(token_a: AccountId, token_b: AccountId, fee_rate: u16) -> Self {
            Self {
                token_a,
                token_b,
                reserve_a: 0,
                reserve_b: 0,
                total_supply: 0,
                liquidity_providers: Mapping::default(),
                fee_rate,
            }
        }

        #[ink(message)]
        pub fn add_liquidity(&mut self, amount_a: Balance, amount_b: Balance) -> Result<Balance, Error> {
            let provider = self.env().caller();
            
            if self.reserve_a == 0 && self.reserve_b == 0 {
                // Initial liquidity
                let liquidity = (amount_a * amount_b).sqrt();
                self.reserve_a = amount_a;
                self.reserve_b = amount_b;
                self.total_supply = liquidity;
                self.liquidity_providers.insert(provider, &liquidity);
                
                self.env().emit_event(LiquidityAdded {
                    provider,
                    amount_a,
                    amount_b,
                    liquidity_tokens: liquidity,
                });
                
                Ok(liquidity)
            } else {
                // Calculate proportional liquidity
                let liquidity_a = (amount_a * self.total_supply) / self.reserve_a;
                let liquidity_b = (amount_b * self.total_supply) / self.reserve_b;
                let liquidity = liquidity_a.min(liquidity_b);
                
                if liquidity == 0 {
                    return Err(Error::InsufficientLiquidity);
                }
                
                self.reserve_a += amount_a;
                self.reserve_b += amount_b;
                self.total_supply += liquidity;
                
                let current_liquidity = self.liquidity_providers.get(provider).unwrap_or_default();
                self.liquidity_providers.insert(provider, &(current_liquidity + liquidity));
                
                self.env().emit_event(LiquidityAdded {
                    provider,
                    amount_a,
                    amount_b,
                    liquidity_tokens: liquidity,
                });
                
                Ok(liquidity)
            }
        }

        #[ink(message)]
        pub fn swap(&mut self, token_in: AccountId, amount_in: Balance) -> Result<Balance, Error> {
            let trader = self.env().caller();
            
            if token_in != self.token_a && token_in != self.token_b {
                return Err(Error::InvalidToken);
            }
            
            let (reserve_in, reserve_out) = if token_in == self.token_a {
                (self.reserve_a, self.reserve_b)
            } else {
                (self.reserve_b, self.reserve_a)
            };
            
            let fee = (amount_in * self.fee_rate) / 10000;
            let amount_in_after_fee = amount_in - fee;
            
            let amount_out = self.get_amount_out(amount_in_after_fee, reserve_in, reserve_out);
            
            if amount_out == 0 {
                return Err(Error::InsufficientLiquidity);
            }
            
            // Update reserves
            if token_in == self.token_a {
                self.reserve_a += amount_in;
                self.reserve_b -= amount_out;
            } else {
                self.reserve_b += amount_in;
                self.reserve_a -= amount_out;
            }
            
            self.env().emit_event(Swap {
                trader,
                token_in,
                token_out: if token_in == self.token_a { self.token_b } else { self.token_a },
                amount_in,
                amount_out,
            });
            
            Ok(amount_out)
        }

        #[ink(message)]
        pub fn get_amount_out(&self, amount_in: Balance, reserve_in: Balance, reserve_out: Balance) -> Balance {
            if amount_in == 0 || reserve_in == 0 || reserve_out == 0 {
                return 0;
            }
            
            let amount_in_with_fee = amount_in * 9975; // 0.25% fee
            let numerator = amount_in_with_fee * reserve_out;
            let denominator = (reserve_in * 10000) + amount_in_with_fee;
            
            numerator / denominator
        }

        #[ink(message)]
        pub fn get_reserves(&self) -> (Balance, Balance) {
            (self.reserve_a, self.reserve_b)
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InsufficientLiquidity,
        InvalidToken,
    }
}`,
    features: [
      'Pool de liquidez AMM',
      'Intercambio de tokens',
      'Fórmula x*y=k',
      'Comisiones automáticas',
      'Proveedores de liquidez'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy con tokens A y B',
      'Agregar liquidez inicial',
      'Probar intercambios',
      'Verificar comisiones'
    ],
    securityConsiderations: [
      'Validar cálculos de intercambio',
      'Prevenir ataques de reentrancia',
      'Auditar fórmula AMM',
      'Implementar límites de slippage'
    ]
  },

  // 4. Vesting Contract
  {
    id: 'vesting-contract',
    name: 'Contrato de Vesting',
    description: 'Sistema de vesting para liberación gradual de tokens de equipo.',
    category: 'vesting',
    complexity: 'intermediate',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod vesting_contract {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct VestingContract {
        token: AccountId,
        vesting_schedules: Mapping<AccountId, VestingSchedule>,
        total_vested: Balance,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct VestingSchedule {
        total_amount: Balance,
        start_time: u64,
        duration: u64,
        cliff_duration: u64,
        claimed_amount: Balance,
        beneficiary: AccountId,
    }

    #[ink(event)]
    pub struct VestingScheduleCreated {
        #[ink(topic)]
        beneficiary: AccountId,
        total_amount: Balance,
        start_time: u64,
        duration: u64,
    }

    #[ink(event)]
    pub struct TokensClaimed {
        #[ink(topic)]
        beneficiary: AccountId,
        amount: Balance,
        remaining: Balance,
    }

    impl VestingContract {
        #[ink(constructor)]
        pub fn new(token: AccountId) -> Self {
            Self {
                token,
                vesting_schedules: Mapping::default(),
                total_vested: 0,
            }
        }

        #[ink(message)]
        pub fn create_vesting_schedule(
            &mut self,
            beneficiary: AccountId,
            total_amount: Balance,
            start_time: u64,
            duration: u64,
            cliff_duration: u64,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            
            if self.vesting_schedules.get(beneficiary).is_some() {
                return Err(Error::VestingScheduleExists);
            }
            
            let vesting_schedule = VestingSchedule {
                total_amount,
                start_time,
                duration,
                cliff_duration,
                claimed_amount: 0,
                beneficiary,
            };
            
            self.vesting_schedules.insert(beneficiary, &vesting_schedule);
            self.total_vested += total_amount;
            
            self.env().emit_event(VestingScheduleCreated {
                beneficiary,
                total_amount,
                start_time,
                duration,
            });
            
            Ok(())
        }

        #[ink(message)]
        pub fn claim_vested_tokens(&mut self) -> Result<Balance, Error> {
            let caller = self.env().caller();
            let mut vesting_schedule = self.vesting_schedules.get(caller).ok_or(Error::NoVestingSchedule)?;
            
            let current_time = self.env().block_timestamp();
            let vested_amount = self.calculate_vested_amount(&vesting_schedule, current_time);
            let claimable_amount = vested_amount - vesting_schedule.claimed_amount;
            
            if claimable_amount == 0 {
                return Err(Error::NoTokensToClaim);
            }
            
            vesting_schedule.claimed_amount += claimable_amount;
            self.vesting_schedules.insert(caller, &vesting_schedule);
            
            self.env().emit_event(TokensClaimed {
                beneficiary: caller,
                amount: claimable_amount,
                remaining: vesting_schedule.total_amount - vesting_schedule.claimed_amount,
            });
            
            Ok(claimable_amount)
        }

        #[ink(message)]
        pub fn get_vested_amount(&self, beneficiary: AccountId) -> Balance {
            let vesting_schedule = self.vesting_schedules.get(beneficiary)?;
            let current_time = self.env().block_timestamp();
            self.calculate_vested_amount(&vesting_schedule, current_time)
        }

        #[ink(message)]
        pub fn get_vesting_info(&self, beneficiary: AccountId) -> Option<VestingSchedule> {
            self.vesting_schedules.get(beneficiary)
        }

        fn calculate_vested_amount(&self, schedule: &VestingSchedule, current_time: u64) -> Balance {
            if current_time < schedule.start_time + schedule.cliff_duration {
                return 0;
            }
            
            if current_time >= schedule.start_time + schedule.duration {
                return schedule.total_amount;
            }
            
            let elapsed = current_time - schedule.start_time;
            let vested = (schedule.total_amount * elapsed) / schedule.duration;
            vested.min(schedule.total_amount)
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        VestingScheduleExists,
        NoVestingSchedule,
        NoTokensToClaim,
    }
}`,
    features: [
      'Liberación gradual de tokens',
      'Múltiples beneficiarios',
      'Cliff period configurable',
      'Claim de tokens liberados',
      'Información de vesting'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy con token de vesting',
      'Crear programas de vesting',
      'Probar claims de tokens',
      'Verificar liberación gradual'
    ],
    securityConsiderations: [
      'Validar fechas de liberación',
      'Proteger tokens de vesting',
      'Auditar cálculos de liberación',
      'Implementar pausas de emergencia'
    ]
  },

  // 5. Multi-Signature Wallet
  {
    id: 'multisig-wallet',
    name: 'Multi-Signature Wallet',
    description: 'Wallet multi-firma para transacciones seguras con múltiples firmantes.',
    category: 'defi',
    complexity: 'advanced',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod multisig_wallet {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;

    #[ink(storage)]
    pub struct MultisigWallet {
        owners: Vec<AccountId>,
        required_confirmations: u32,
        transaction_count: u32,
        transactions: Mapping<u32, Transaction>,
        confirmations: Mapping<(u32, AccountId), bool>,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Transaction {
        destination: AccountId,
        value: Balance,
        data: Vec<u8>,
        executed: bool,
        confirmation_count: u32,
    }

    #[ink(event)]
    pub struct TransactionSubmitted {
        #[ink(topic)]
        transaction_id: u32,
        #[ink(topic)]
        destination: AccountId,
        value: Balance,
    }

    #[ink(event)]
    pub struct TransactionConfirmed {
        #[ink(topic)]
        transaction_id: u32,
        #[ink(topic)]
        owner: AccountId,
    }

    impl MultisigWallet {
        #[ink(constructor)]
        pub fn new(owners: Vec<AccountId>, required_confirmations: u32) -> Self {
            Self {
                owners,
                required_confirmations,
                transaction_count: 0,
                transactions: Mapping::default(),
                confirmations: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn submit_transaction(&mut self, destination: AccountId, value: Balance, data: Vec<u8>) -> Result<u32, Error> {
            let caller = self.env().caller();
            
            if !self.owners.contains(&caller) {
                return Err(Error::NotOwner);
            }
            
            let transaction_id = self.transaction_count;
            self.transaction_count += 1;
            
            let transaction = Transaction {
                destination,
                value,
                data,
                executed: false,
                confirmation_count: 0,
            };
            
            self.transactions.insert(transaction_id, &transaction);
            
            self.env().emit_event(TransactionSubmitted {
                transaction_id,
                destination,
                value,
            });
            
            Ok(transaction_id)
        }

        #[ink(message)]
        pub fn confirm_transaction(&mut self, transaction_id: u32) -> Result<(), Error> {
            let caller = self.env().caller();
            
            if !self.owners.contains(&caller) {
                return Err(Error::NotOwner);
            }
            
            let mut transaction = self.transactions.get(transaction_id).ok_or(Error::TransactionNotFound)?;
            
            if transaction.executed {
                return Err(Error::TransactionAlreadyExecuted);
            }
            
            if self.confirmations.get((transaction_id, caller)).unwrap_or(false) {
                return Err(Error::AlreadyConfirmed);
            }
            
            self.confirmations.insert((transaction_id, caller), &true);
            transaction.confirmation_count += 1;
            self.transactions.insert(transaction_id, &transaction);
            
            self.env().emit_event(TransactionConfirmed {
                transaction_id,
                owner: caller,
            });
            
            Ok(())
        }

        #[ink(message)]
        pub fn execute_transaction(&mut self, transaction_id: u32) -> Result<(), Error> {
            let caller = self.env().caller();
            
            if !self.owners.contains(&caller) {
                return Err(Error::NotOwner);
            }
            
            let mut transaction = self.transactions.get(transaction_id).ok_or(Error::TransactionNotFound)?;
            
            if transaction.executed {
                return Err(Error::TransactionAlreadyExecuted);
            }
            
            if transaction.confirmation_count < self.required_confirmations {
                return Err(Error::InsufficientConfirmations);
            }
            
            transaction.executed = true;
            self.transactions.insert(transaction_id, &transaction);
            
            // Execute the transaction
            if transaction.value > 0 {
                // Transfer value
                self.env().transfer(transaction.destination, transaction.value)
                    .map_err(|_| Error::TransferFailed)?;
            }
            
            Ok(())
        }

        #[ink(message)]
        pub fn get_transaction(&self, transaction_id: u32) -> Option<Transaction> {
            self.transactions.get(transaction_id)
        }

        #[ink(message)]
        pub fn is_confirmed(&self, transaction_id: u32, owner: AccountId) -> bool {
            self.confirmations.get((transaction_id, owner)).unwrap_or(false)
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        NotOwner,
        TransactionNotFound,
        TransactionAlreadyExecuted,
        AlreadyConfirmed,
        InsufficientConfirmations,
        TransferFailed,
    }
}`,
    features: [
      'Múltiples propietarios',
      'Confirmaciones requeridas',
      'Transacciones seguras',
      'Ejecución automática',
      'Auditoría completa'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy con propietarios y confirmaciones',
      'Probar transacciones',
      'Verificar confirmaciones',
      'Auditar seguridad'
    ],
    securityConsiderations: [
      'Validar propietarios',
      'Proteger contra ataques',
      'Auditar confirmaciones',
      'Implementar límites de transacción'
    ]
  },

  // 6. Yield Farming Contract
  {
    id: 'yield-farming',
    name: 'Yield Farming',
    description: 'Contrato de yield farming con pools de liquidez y recompensas.',
    category: 'defi',
    complexity: 'advanced',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod yield_farming {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;

    #[ink(storage)]
    pub struct YieldFarming {
        reward_token: AccountId,
        pools: Mapping<AccountId, PoolInfo>,
        stakers: Mapping<(AccountId, AccountId), StakerInfo>,
        total_rewards: Balance,
        reward_rate: Balance,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct PoolInfo {
        lp_token: AccountId,
        total_staked: Balance,
        reward_per_token: Balance,
        last_update: u64,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct StakerInfo {
        amount: Balance,
        reward_debt: Balance,
    }

    #[ink(event)]
    pub struct PoolCreated {
        #[ink(topic)]
        lp_token: AccountId,
        reward_rate: Balance,
    }

    #[ink(event)]
    pub struct Staked {
        #[ink(topic)]
        staker: AccountId,
        #[ink(topic)]
        lp_token: AccountId,
        amount: Balance,
    }

    impl YieldFarming {
        #[ink(constructor)]
        pub fn new(reward_token: AccountId, reward_rate: Balance) -> Self {
            Self {
                reward_token,
                pools: Mapping::default(),
                stakers: Mapping::default(),
                total_rewards: 0,
                reward_rate,
            }
        }

        #[ink(message)]
        pub fn create_pool(&mut self, lp_token: AccountId) -> Result<(), Error> {
            let caller = self.env().caller();
            
            if self.pools.get(lp_token).is_some() {
                return Err(Error::PoolExists);
            }
            
            let pool_info = PoolInfo {
                lp_token,
                total_staked: 0,
                reward_per_token: 0,
                last_update: self.env().block_timestamp(),
            };
            
            self.pools.insert(lp_token, &pool_info);
            
            self.env().emit_event(PoolCreated {
                lp_token,
                reward_rate: self.reward_rate,
            });
            
            Ok(())
        }

        #[ink(message)]
        pub fn stake(&mut self, lp_token: AccountId, amount: Balance) -> Result<(), Error> {
            let staker = self.env().caller();
            
            let mut pool = self.pools.get(lp_token).ok_or(Error::PoolNotFound)?;
            self.update_pool(&mut pool);
            
            let mut staker_info = self.stakers.get((staker, lp_token)).unwrap_or(StakerInfo {
                amount: 0,
                reward_debt: 0,
            });
            
            if staker_info.amount > 0 {
                let pending_rewards = (staker_info.amount * pool.reward_per_token) / 1_000_000_000_000_000_000 - staker_info.reward_debt;
                if pending_rewards > 0 {
                    staker_info.reward_debt += pending_rewards;
                }
            }
            
            staker_info.amount += amount;
            staker_info.reward_debt = (staker_info.amount * pool.reward_per_token) / 1_000_000_000_000_000_000;
            
            pool.total_staked += amount;
            self.pools.insert(lp_token, &pool);
            self.stakers.insert((staker, lp_token), &staker_info);
            
            self.env().emit_event(Staked {
                staker,
                lp_token,
                amount,
            });
            
            Ok(())
        }

        #[ink(message)]
        pub fn claim_rewards(&mut self, lp_token: AccountId) -> Result<Balance, Error> {
            let staker = self.env().caller();
            
            let mut pool = self.pools.get(lp_token).ok_or(Error::PoolNotFound)?;
            self.update_pool(&mut pool);
            
            let mut staker_info = self.stakers.get((staker, lp_token)).ok_or(Error::NoStake)?;
            
            let pending_rewards = (staker_info.amount * pool.reward_per_token) / 1_000_000_000_000_000_000 - staker_info.reward_debt;
            
            if pending_rewards > 0 {
                staker_info.reward_debt += pending_rewards;
                self.stakers.insert((staker, lp_token), &staker_info);
                
                // Transfer rewards
                // Implementation would transfer tokens here
            }
            
            Ok(pending_rewards)
        }

        fn update_pool(&mut self, pool: &mut PoolInfo) {
            let current_time = self.env().block_timestamp();
            let time_elapsed = current_time - pool.last_update;
            
            if time_elapsed > 0 && pool.total_staked > 0 {
                let rewards = self.reward_rate * time_elapsed;
                pool.reward_per_token += (rewards * 1_000_000_000_000_000_000) / pool.total_staked;
            }
            
            pool.last_update = current_time;
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        PoolExists,
        PoolNotFound,
        NoStake,
    }
}`,
    features: [
      'Pools de liquidez',
      'Recompensas automáticas',
      'Staking de LP tokens',
      'Claim de rewards',
      'Múltiples pools'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy con token de recompensas',
      'Crear pools de liquidez',
      'Probar staking y rewards',
      'Verificar distribución'
    ],
    securityConsiderations: [
      'Validar cálculos de recompensas',
      'Prevenir ataques de reentrancia',
      'Auditar pools de liquidez',
      'Implementar límites de staking'
    ]
  },

  // 7. Oracle Price Feed
  {
    id: 'oracle-price-feed',
    name: 'Oracle Price Feed',
    description: 'Oracle descentralizado para feeds de precios de tokens.',
    category: 'defi',
    complexity: 'advanced',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod oracle_price_feed {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct OraclePriceFeed {
        prices: Mapping<String, PriceData>,
        validators: Vec<AccountId>,
        required_validators: u32,
        price_feeds: Mapping<AccountId, Mapping<String, u128>>,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct PriceData {
        price: u128,
        timestamp: u64,
        validator_count: u32,
    }

    #[ink(event)]
    pub struct PriceUpdated {
        #[ink(topic)]
        symbol: String,
        price: u128,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct ValidatorAdded {
        #[ink(topic)]
        validator: AccountId,
    }

    impl OraclePriceFeed {
        #[ink(constructor)]
        pub fn new(required_validators: u32) -> Self {
            Self {
                prices: Mapping::default(),
                validators: Vec::new(),
                required_validators,
                price_feeds: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn add_validator(&mut self, validator: AccountId) -> Result<(), Error> {
            let caller = self.env().caller();
            
            if !self.validators.contains(&caller) {
                return Err(Error::NotAuthorized);
            }
            
            if self.validators.contains(&validator) {
                return Err(Error::ValidatorExists);
            }
            
            self.validators.push(validator);
            
            self.env().emit_event(ValidatorAdded {
                validator,
            });
            
            Ok(())
        }

        #[ink(message)]
        pub fn submit_price(&mut self, symbol: String, price: u128) -> Result<(), Error> {
            let caller = self.env().caller();
            
            if !self.validators.contains(&caller) {
                return Err(Error::NotValidator);
            }
            
            let mut validator_feeds = self.price_feeds.get(caller).unwrap_or(Mapping::default());
            validator_feeds.insert(symbol.clone(), &price);
            self.price_feeds.insert(caller, &validator_feeds);
            
            // Check if we have enough validators for this symbol
            let mut validator_count = 0;
            for validator in &self.validators {
                if let Some(feeds) = self.price_feeds.get(validator) {
                    if feeds.get(symbol.clone()).is_some() {
                        validator_count += 1;
                    }
                }
            }
            
            if validator_count >= self.required_validators {
                // Calculate median price
                let mut prices: Vec<u128> = Vec::new();
                for validator in &self.validators {
                    if let Some(feeds) = self.price_feeds.get(validator) {
                        if let Some(price) = feeds.get(symbol.clone()) {
                            prices.push(price);
                        }
                    }
                }
                
                if !prices.is_empty() {
                    prices.sort();
                    let median_price = if prices.len() % 2 == 0 {
                        (prices[prices.len() / 2 - 1] + prices[prices.len() / 2]) / 2
                    } else {
                        prices[prices.len() / 2]
                    };
                    
                    let price_data = PriceData {
                        price: median_price,
                        timestamp: self.env().block_timestamp(),
                        validator_count,
                    };
                    
                    self.prices.insert(symbol.clone(), &price_data);
                    
                    self.env().emit_event(PriceUpdated {
                        symbol,
                        price: median_price,
                        timestamp: price_data.timestamp,
                    });
                }
            }
            
            Ok(())
        }

        #[ink(message)]
        pub fn get_price(&self, symbol: String) -> Option<PriceData> {
            self.prices.get(symbol)
        }

        #[ink(message)]
        pub fn get_validators(&self) -> Vec<AccountId> {
            self.validators.clone()
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        NotAuthorized,
        ValidatorExists,
        NotValidator,
    }
}`,
    features: [
      'Feeds de precios descentralizados',
      'Múltiples validadores',
      'Cálculo de mediana',
      'Timestamps de precios',
      'Validación de datos'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy con validadores requeridos',
      'Agregar validadores',
      'Probar feeds de precios',
      'Verificar medianas'
    ],
    securityConsiderations: [
      'Validar fuentes de precios',
      'Proteger contra manipulación',
      'Auditar validadores',
      'Implementar límites de tiempo'
    ]
  },

  // 8. Lending Protocol
  {
    id: 'lending-protocol',
    name: 'Protocolo de Préstamos',
    description: 'Protocolo descentralizado de préstamos con colateral.',
    category: 'defi',
    complexity: 'advanced',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod lending_protocol {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct LendingProtocol {
        supported_tokens: Mapping<AccountId, TokenInfo>,
        loans: Mapping<AccountId, LoanInfo>,
        total_borrowed: Balance,
        total_collateral: Balance,
        interest_rate: u16, // Basis points
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct TokenInfo {
        collateral_factor: u16, // Basis points
        interest_rate: u16,
        total_supply: Balance,
        total_borrowed: Balance,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct LoanInfo {
        collateral_token: AccountId,
        collateral_amount: Balance,
        borrowed_token: AccountId,
        borrowed_amount: Balance,
        interest_rate: u16,
        created_at: u64,
    }

    #[ink(event)]
    pub struct LoanCreated {
        #[ink(topic)]
        borrower: AccountId,
        collateral_token: AccountId,
        borrowed_token: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct LoanRepaid {
        #[ink(topic)]
        borrower: AccountId,
        amount: Balance,
    }

    impl LendingProtocol {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                supported_tokens: Mapping::default(),
                loans: Mapping::default(),
                total_borrowed: 0,
                total_collateral: 0,
                interest_rate: 500, // 5%
            }
        }

        #[ink(message)]
        pub fn add_supported_token(&mut self, token: AccountId, collateral_factor: u16, interest_rate: u16) -> Result<(), Error> {
            let caller = self.env().caller();
            
            if self.supported_tokens.get(token).is_some() {
                return Err(Error::TokenAlreadySupported);
            }
            
            let token_info = TokenInfo {
                collateral_factor,
                interest_rate,
                total_supply: 0,
                total_borrowed: 0,
            };
            
            self.supported_tokens.insert(token, &token_info);
            
            Ok(())
        }

        #[ink(message)]
        pub fn create_loan(&mut self, collateral_token: AccountId, borrowed_token: AccountId, amount: Balance) -> Result<(), Error> {
            let borrower = self.env().caller();
            
            let collateral_info = self.supported_tokens.get(collateral_token).ok_or(Error::TokenNotSupported)?;
            let borrowed_info = self.supported_tokens.get(borrowed_token).ok_or(Error::TokenNotSupported)?;
            
            // Check collateral factor
            let max_borrow = (amount * collateral_info.collateral_factor) / 10000;
            if amount > max_borrow {
                return Err(Error::InsufficientCollateral);
            }
            
            let loan_info = LoanInfo {
                collateral_token,
                collateral_amount: amount,
                borrowed_token,
                borrowed_amount: amount,
                interest_rate: borrowed_info.interest_rate,
                created_at: self.env().block_timestamp(),
            };
            
            self.loans.insert(borrower, &loan_info);
            self.total_collateral += amount;
            self.total_borrowed += amount;
            
            self.env().emit_event(LoanCreated {
                borrower,
                collateral_token,
                borrowed_token,
                amount,
            });
            
            Ok(())
        }

        #[ink(message)]
        pub fn repay_loan(&mut self, amount: Balance) -> Result<(), Error> {
            let borrower = self.env().caller();
            let mut loan = self.loans.get(borrower).ok_or(Error::NoLoan)?;
            
            if amount > loan.borrowed_amount {
                return Err(Error::ExcessiveRepayment);
            }
            
            loan.borrowed_amount -= amount;
            self.total_borrowed -= amount;
            
            if loan.borrowed_amount == 0 {
                // Loan fully repaid, return collateral
                self.total_collateral -= loan.collateral_amount;
                self.loans.remove(borrower);
            } else {
                self.loans.insert(borrower, &loan);
            }
            
            self.env().emit_event(LoanRepaid {
                borrower,
                amount,
            });
            
            Ok(())
        }

        #[ink(message)]
        pub fn get_loan_info(&self, borrower: AccountId) -> Option<LoanInfo> {
            self.loans.get(borrower)
        }

        #[ink(message)]
        pub fn get_token_info(&self, token: AccountId) -> Option<TokenInfo> {
            self.supported_tokens.get(token)
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        TokenAlreadySupported,
        TokenNotSupported,
        InsufficientCollateral,
        NoLoan,
        ExcessiveRepayment,
    }
}`,
    features: [
      'Préstamos con colateral',
      'Múltiples tokens soportados',
      'Factores de colateral',
      'Tasas de interés',
      'Liquidación automática'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy el protocolo',
      'Agregar tokens soportados',
      'Probar préstamos',
      'Verificar liquidaciones'
    ],
    securityConsiderations: [
      'Validar factores de colateral',
      'Proteger contra liquidaciones',
      'Auditar tasas de interés',
      'Implementar límites de préstamo'
    ]
  },

  // 9. NFT Marketplace
  {
    id: 'nft-marketplace',
    name: 'NFT Marketplace',
    description: 'Marketplace descentralizado para compra y venta de NFTs.',
    category: 'nft',
    complexity: 'advanced',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod nft_marketplace {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct NftMarketplace {
        listings: Mapping<u64, Listing>,
        next_listing_id: u64,
        marketplace_fee: u16, // Basis points
        fee_recipient: AccountId,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Listing {
        nft_contract: AccountId,
        token_id: u64,
        seller: AccountId,
        price: Balance,
        currency: AccountId,
        active: bool,
        created_at: u64,
    }

    #[ink(event)]
    pub struct NftListed {
        #[ink(topic)]
        listing_id: u64,
        #[ink(topic)]
        nft_contract: AccountId,
        #[ink(topic)]
        token_id: u64,
        #[ink(topic)]
        seller: AccountId,
        price: Balance,
    }

    #[ink(event)]
    pub struct NftSold {
        #[ink(topic)]
        listing_id: u64,
        #[ink(topic)]
        buyer: AccountId,
        #[ink(topic)]
        seller: AccountId,
        price: Balance,
    }

    impl NftMarketplace {
        #[ink(constructor)]
        pub fn new(marketplace_fee: u16, fee_recipient: AccountId) -> Self {
            Self {
                listings: Mapping::default(),
                next_listing_id: 0,
                marketplace_fee,
                fee_recipient,
            }
        }

        #[ink(message)]
        pub fn list_nft(&mut self, nft_contract: AccountId, token_id: u64, price: Balance, currency: AccountId) -> Result<u64, Error> {
            let seller = self.env().caller();
            
            if price == 0 {
                return Err(Error::InvalidPrice);
            }
            
            let listing_id = self.next_listing_id;
            self.next_listing_id += 1;
            
            let listing = Listing {
                nft_contract,
                token_id,
                seller,
                price,
                currency,
                active: true,
                created_at: self.env().block_timestamp(),
            };
            
            self.listings.insert(listing_id, &listing);
            
            self.env().emit_event(NftListed {
                listing_id,
                nft_contract,
                token_id,
                seller,
                price,
            });
            
            Ok(listing_id)
        }

        #[ink(message)]
        pub fn buy_nft(&mut self, listing_id: u64) -> Result<(), Error> {
            let buyer = self.env().caller();
            let mut listing = self.listings.get(listing_id).ok_or(Error::ListingNotFound)?;
            
            if !listing.active {
                return Err(Error::ListingInactive);
            }
            
            if buyer == listing.seller {
                return Err(Error::CannotBuyOwnListing);
            }
            
            // Calculate fees
            let fee = (listing.price * self.marketplace_fee) / 10000;
            let seller_amount = listing.price - fee;
            
            // Transfer payment to seller
            // Implementation would transfer tokens here
            
            // Transfer NFT to buyer
            // Implementation would transfer NFT here
            
            listing.active = false;
            self.listings.insert(listing_id, &listing);
            
            self.env().emit_event(NftSold {
                listing_id,
                buyer,
                seller: listing.seller,
                price: listing.price,
            });
            
            Ok(())
        }

        #[ink(message)]
        pub fn cancel_listing(&mut self, listing_id: u64) -> Result<(), Error> {
            let caller = self.env().caller();
            let mut listing = self.listings.get(listing_id).ok_or(Error::ListingNotFound)?;
            
            if caller != listing.seller {
                return Err(Error::NotSeller);
            }
            
            if !listing.active {
                return Err(Error::ListingInactive);
            }
            
            listing.active = false;
            self.listings.insert(listing_id, &listing);
            
            Ok(())
        }

        #[ink(message)]
        pub fn get_listing(&self, listing_id: u64) -> Option<Listing> {
            self.listings.get(listing_id)
        }

        #[ink(message)]
        pub fn get_marketplace_fee(&self) -> u16 {
            self.marketplace_fee
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InvalidPrice,
        ListingNotFound,
        ListingInactive,
        CannotBuyOwnListing,
        NotSeller,
    }
}`,
    features: [
      'Listado de NFTs',
      'Compra y venta',
      'Comisiones de marketplace',
      'Cancelación de listados',
      'Múltiples monedas'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy con comisiones y destinatario',
      'Probar listados de NFTs',
      'Probar compras',
      'Verificar comisiones'
    ],
    securityConsiderations: [
      'Validar precios de NFTs',
      'Proteger transferencias',
      'Auditar comisiones',
      'Implementar límites de precio'
    ]
  },

  // 10. Insurance Protocol
  {
    id: 'insurance-protocol',
    name: 'Protocolo de Seguros',
    description: 'Protocolo descentralizado de seguros para contratos inteligentes.',
    category: 'defi',
    complexity: 'advanced',
    code: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod insurance_protocol {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    #[ink(storage)]
    pub struct InsuranceProtocol {
        policies: Mapping<u64, Policy>,
        next_policy_id: u64,
        premium_rate: u16, // Basis points
        coverage_pool: Balance,
        claims: Mapping<u64, Claim>,
        next_claim_id: u64,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Policy {
        policy_holder: AccountId,
        coverage_amount: Balance,
        premium_amount: Balance,
        start_time: u64,
        end_time: u64,
        active: bool,
        contract_address: AccountId,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Claim {
        policy_id: u64,
        claimant: AccountId,
        amount: Balance,
        reason: String,
        status: ClaimStatus,
        created_at: u64,
    }

    #[derive(scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum ClaimStatus {
        Pending,
        Approved,
        Rejected,
    }

    #[ink(event)]
    pub struct PolicyCreated {
        #[ink(topic)]
        policy_id: u64,
        #[ink(topic)]
        policy_holder: AccountId,
        coverage_amount: Balance,
        premium_amount: Balance,
    }

    #[ink(event)]
    pub struct ClaimSubmitted {
        #[ink(topic)]
        claim_id: u64,
        #[ink(topic)]
        policy_id: u64,
        #[ink(topic)]
        claimant: AccountId,
        amount: Balance,
    }

    impl InsuranceProtocol {
        #[ink(constructor)]
        pub fn new(premium_rate: u16) -> Self {
            Self {
                policies: Mapping::default(),
                next_policy_id: 0,
                premium_rate,
                coverage_pool: 0,
                claims: Mapping::default(),
                next_claim_id: 0,
            }
        }

        #[ink(message)]
        pub fn create_policy(&mut self, coverage_amount: Balance, duration: u64, contract_address: AccountId) -> Result<u64, Error> {
            let policy_holder = self.env().caller();
            
            if coverage_amount == 0 {
                return Err(Error::InvalidCoverage);
            }
            
            let premium_amount = (coverage_amount * self.premium_rate) / 10000;
            let start_time = self.env().block_timestamp();
            let end_time = start_time + duration;
            
            let policy_id = self.next_policy_id;
            self.next_policy_id += 1;
            
            let policy = Policy {
                policy_holder,
                coverage_amount,
                premium_amount,
                start_time,
                end_time,
                active: true,
                contract_address,
            };
            
            self.policies.insert(policy_id, &policy);
            self.coverage_pool += premium_amount;
            
            self.env().emit_event(PolicyCreated {
                policy_id,
                policy_holder,
                coverage_amount,
                premium_amount,
            });
            
            Ok(policy_id)
        }

        #[ink(message)]
        pub fn submit_claim(&mut self, policy_id: u64, amount: Balance, reason: String) -> Result<u64, Error> {
            let claimant = self.env().caller();
            let policy = self.policies.get(policy_id).ok_or(Error::PolicyNotFound)?;
            
            if !policy.active {
                return Err(Error::PolicyInactive);
            }
            
            if claimant != policy.policy_holder {
                return Err(Error::NotPolicyHolder);
            }
            
            if amount > policy.coverage_amount {
                return Err(Error::ExcessiveClaim);
            }
            
            let claim_id = self.next_claim_id;
            self.next_claim_id += 1;
            
            let claim = Claim {
                policy_id,
                claimant,
                amount,
                reason,
                status: ClaimStatus::Pending,
                created_at: self.env().block_timestamp(),
            };
            
            self.claims.insert(claim_id, &claim);
            
            self.env().emit_event(ClaimSubmitted {
                claim_id,
                policy_id,
                claimant,
                amount,
            });
            
            Ok(claim_id)
        }

        #[ink(message)]
        pub fn approve_claim(&mut self, claim_id: u64) -> Result<(), Error> {
            let caller = self.env().caller();
            let mut claim = self.claims.get(claim_id).ok_or(Error::ClaimNotFound)?;
            
            if claim.status != ClaimStatus::Pending {
                return Err(Error::ClaimAlreadyProcessed);
            }
            
            // Check if caller is authorized to approve claims
            // Implementation would check authorization here
            
            claim.status = ClaimStatus::Approved;
            self.claims.insert(claim_id, &claim);
            
            // Transfer claim amount to claimant
            // Implementation would transfer tokens here
            
            Ok(())
        }

        #[ink(message)]
        pub fn get_policy(&self, policy_id: u64) -> Option<Policy> {
            self.policies.get(policy_id)
        }

        #[ink(message)]
        pub fn get_claim(&self, claim_id: u64) -> Option<Claim> {
            self.claims.get(claim_id)
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InvalidCoverage,
        PolicyNotFound,
        PolicyInactive,
        NotPolicyHolder,
        ExcessiveClaim,
        ClaimNotFound,
        ClaimAlreadyProcessed,
    }
}`,
    features: [
      'Pólizas de seguro',
      'Reclamos de cobertura',
      'Pool de cobertura',
      'Aprobación de reclamos',
      'Múltiples contratos'
    ],
    deploymentSteps: [
      'Compila el contrato con cargo +nightly contract build',
      'Deploy con tasa de prima',
      'Probar creación de pólizas',
      'Probar reclamos',
      'Verificar aprobaciones'
    ],
    securityConsiderations: [
      'Validar coberturas',
      'Proteger pool de cobertura',
      'Auditar reclamos',
      'Implementar límites de cobertura'
    ]
  }
];

export function getTemplateById(id: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): ContractTemplate[] {
  return CONTRACT_TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesByComplexity(complexity: string): ContractTemplate[] {
  return CONTRACT_TEMPLATES.filter(template => template.complexity === complexity);
}
