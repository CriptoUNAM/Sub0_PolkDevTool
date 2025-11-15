#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// DevKit Showcase Contract - DAO Governance con Staking
/// 
/// Este contrato demuestra el poder de Polkadot DevKit generando
/// un contrato complejo con funcionalidades de gobernanza y staking.
/// 
/// Generado con Polkadot DevKit para sub0 Hackathon 2025
#[ink::contract]
mod devkit_showcase {
    use ink::storage::Mapping;
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;

    /// Storage del contrato
    #[ink(storage)]
    pub struct DevKitShowcase {
        /// Token de gobernanza
        governance_token: AccountId,
        /// Propuestas activas
        proposals: Mapping<u32, Proposal>,
        /// Contador de propuestas
        proposal_count: u32,
        /// Período de votación en bloques
        voting_period: u64,
        /// Umbral de quórum (en tokens)
        quorum_threshold: Balance,
        /// Pool de staking
        staking_pool: Balance,
        /// Información de stakers
        stakers: Mapping<AccountId, StakerInfo>,
        /// Tasa de recompensas por bloque
        reward_rate: Balance,
        /// Última actualización de recompensas
        last_reward_update: u64,
    }

    /// Información de una propuesta
    #[derive(Debug, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Proposal {
        /// Creador de la propuesta
        proposer: AccountId,
        /// Descripción de la propuesta
        description: String,
        /// Tiempo de inicio
        start_time: u64,
        /// Tiempo de fin
        end_time: u64,
        /// Votos a favor
        for_votes: Balance,
        /// Votos en contra
        against_votes: Balance,
        /// Ejecutada
        executed: bool,
        /// Votantes
        voters: Vec<AccountId>,
    }

    /// Información de un staker
    #[derive(Debug, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct StakerInfo {
        /// Cantidad staked
        amount: Balance,
        /// Deuda de recompensas
        reward_debt: Balance,
        /// Última actualización
        last_update: u64,
    }

    /// Eventos del contrato
    #[ink(event)]
    pub struct ProposalCreated {
        #[ink(topic)]
        proposal_id: u32,
        #[ink(topic)]
        proposer: AccountId,
        description: String,
    }

    #[ink(event)]
    pub struct Voted {
        #[ink(topic)]
        proposal_id: u32,
        #[ink(topic)]
        voter: AccountId,
        support: bool,
        votes: Balance,
    }

    #[ink(event)]
    pub struct ProposalExecuted {
        #[ink(topic)]
        proposal_id: u32,
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

    impl DevKitShowcase {
        /// Constructor del contrato
        #[ink(constructor)]
        pub fn new(
            governance_token: AccountId,
            voting_period: u64,
            quorum_threshold: Balance,
            reward_rate: Balance,
        ) -> Self {
            Self {
                governance_token,
                proposals: Mapping::default(),
                proposal_count: 0,
                voting_period,
                quorum_threshold,
                staking_pool: 0,
                stakers: Mapping::default(),
                reward_rate,
                last_reward_update: Self::env().block_timestamp(),
            }
        }

        /// Crear una nueva propuesta
        #[ink(message)]
        pub fn propose(&mut self, description: String) -> Result<u32, Error> {
            let caller = Self::env().caller();
            let proposal_id = self.proposal_count;
            self.proposal_count += 1;

            let now = Self::env().block_timestamp();
            let proposal = Proposal {
                proposer: caller,
                description: description.clone(),
                start_time: now,
                end_time: now + self.voting_period,
                for_votes: 0,
                against_votes: 0,
                executed: false,
                voters: Vec::new(),
            };

            self.proposals.insert(proposal_id, &proposal);

            Self::env().emit_event(ProposalCreated {
                proposal_id,
                proposer: caller,
                description,
            });

            Ok(proposal_id)
        }

        /// Votar en una propuesta
        #[ink(message)]
        pub fn vote(&mut self, proposal_id: u32, support: bool) -> Result<(), Error> {
            let caller = Self::env().caller();
            let mut proposal = self.proposals.get(proposal_id)
                .ok_or(Error::ProposalNotFound)?;

            let now = Self::env().block_timestamp();
            if now > proposal.end_time {
                return Err(Error::VotingPeriodEnded);
            }

            if proposal.voters.contains(&caller) {
                return Err(Error::AlreadyVoted);
            }

            // Obtener balance de tokens del votante (simplificado)
            // En producción, consultar el contrato de tokens
            let voter_balance = self.get_voter_balance(caller);

            if support {
                proposal.for_votes += voter_balance;
            } else {
                proposal.against_votes += voter_balance;
            }

            proposal.voters.push(caller);
            self.proposals.insert(proposal_id, &proposal);

            Self::env().emit_event(Voted {
                proposal_id,
                voter: caller,
                support,
                votes: voter_balance,
            });

            Ok(())
        }

        /// Ejecutar una propuesta aprobada
        #[ink(message)]
        pub fn execute(&mut self, proposal_id: u32) -> Result<(), Error> {
            let mut proposal = self.proposals.get(proposal_id)
                .ok_or(Error::ProposalNotFound)?;

            if proposal.executed {
                return Err(Error::AlreadyExecuted);
            }

            let now = Self::env().block_timestamp();
            if now <= proposal.end_time {
                return Err(Error::VotingPeriodActive);
            }

            let total_votes = proposal.for_votes + proposal.against_votes;
            if total_votes < self.quorum_threshold {
                return Err(Error::QuorumNotMet);
            }

            if proposal.for_votes <= proposal.against_votes {
                return Err(Error::ProposalRejected);
            }

            proposal.executed = true;
            self.proposals.insert(proposal_id, &proposal);

            Self::env().emit_event(ProposalExecuted {
                proposal_id,
            });

            Ok(())
        }

        /// Hacer stake de tokens
        #[ink(message)]
        pub fn stake(&mut self, amount: Balance) -> Result<(), Error> {
            let staker = Self::env().caller();
            
            if amount == 0 {
                return Err(Error::InvalidAmount);
            }

            self.update_rewards(staker);

            let mut staker_info = self.stakers.get(staker).unwrap_or(StakerInfo {
                amount: 0,
                reward_debt: 0,
                last_update: Self::env().block_timestamp(),
            });

            staker_info.amount += amount;
            staker_info.last_update = Self::env().block_timestamp();
            self.stakers.insert(staker, &staker_info);

            self.staking_pool += amount;

            Self::env().emit_event(Staked {
                staker,
                amount,
            });

            Ok(())
        }

        /// Retirar stake
        #[ink(message)]
        pub fn unstake(&mut self, amount: Balance) -> Result<(), Error> {
            let staker = Self::env().caller();
            let mut staker_info = self.stakers.get(staker)
                .ok_or(Error::NoStake)?;

            if staker_info.amount < amount {
                return Err(Error::InsufficientStake);
            }

            self.update_rewards(staker);

            staker_info.amount -= amount;
            staker_info.last_update = Self::env().block_timestamp();
            self.stakers.insert(staker, &staker_info);

            self.staking_pool -= amount;

            Ok(())
        }

        /// Reclamar recompensas
        #[ink(message)]
        pub fn claim_rewards(&mut self) -> Result<Balance, Error> {
            let staker = Self::env().caller();
            self.update_rewards(staker);

            let mut staker_info = self.stakers.get(staker)
                .ok_or(Error::NoStake)?;

            let rewards = staker_info.reward_debt;
            if rewards == 0 {
                return Err(Error::NoRewards);
            }

            staker_info.reward_debt = 0;
            staker_info.last_update = Self::env().block_timestamp();
            self.stakers.insert(staker, &staker_info);

            Self::env().emit_event(RewardsClaimed {
                staker,
                amount: rewards,
            });

            Ok(rewards)
        }

        /// Obtener información de una propuesta
        #[ink(message)]
        pub fn get_proposal(&self, proposal_id: u32) -> Option<Proposal> {
            self.proposals.get(proposal_id)
        }

        /// Obtener información de staking
        #[ink(message)]
        pub fn get_staker_info(&self, staker: AccountId) -> Option<StakerInfo> {
            self.stakers.get(staker)
        }

        /// Obtener balance del pool de staking
        #[ink(message)]
        pub fn get_staking_pool(&self) -> Balance {
            self.staking_pool
        }

        /// Actualizar recompensas de un staker
        fn update_rewards(&mut self, staker: AccountId) {
            let current_time = Self::env().block_timestamp();
            let time_elapsed = current_time.saturating_sub(self.last_reward_update);

            if time_elapsed > 0 && self.staking_pool > 0 {
                let total_rewards = self.reward_rate
                    .checked_mul(time_elapsed)
                    .unwrap_or(0);

                if let Some(mut staker_info) = self.stakers.get(staker) {
                    if staker_info.amount > 0 {
                        let staker_share = (staker_info.amount
                            .checked_mul(total_rewards))
                            .and_then(|x| x.checked_div(self.staking_pool))
                            .unwrap_or(0);

                        staker_info.reward_debt = staker_info.reward_debt
                            .checked_add(staker_share)
                            .unwrap_or(staker_info.reward_debt);
                    }

                    staker_info.last_update = current_time;
                    self.stakers.insert(staker, &staker_info);
                }
            }

            self.last_reward_update = current_time;
        }

        /// Obtener balance de tokens del votante (simplificado)
        /// En producción, consultar el contrato de tokens
        fn get_voter_balance(&self, voter: AccountId) -> Balance {
            // Simplificado: retornar balance fijo
            // En producción, hacer cross-contract call al governance_token
            1000
        }
    }

    /// Errores del contrato
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        ProposalNotFound,
        VotingPeriodEnded,
        VotingPeriodActive,
        QuorumNotMet,
        ProposalRejected,
        AlreadyExecuted,
        AlreadyVoted,
        InvalidAmount,
        NoStake,
        InsufficientStake,
        NoRewards,
    }
}

