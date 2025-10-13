#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod advanced_staking_pool {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;

    #[ink(storage)]
    pub struct AdvancedStakingPool {
        total_staked: Balance,
        staking_period: u64,
        reward_rate: u128, // basis points (10000 = 100%)
        stakers: Mapping<AccountId, StakerInfo>,
        pool_owner: AccountId,
        reward_token: AccountId,
        last_update: u64,
    }

    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct StakerInfo {
        amount: Balance,
        reward_debt: Balance,
        last_stake_time: u64,
    }

    #[ink(event)]
    pub struct Staked {
        #[ink(topic)]
        staker: AccountId,
        amount: Balance,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct Unstaked {
        #[ink(topic)]
        staker: AccountId,
        amount: Balance,
        rewards: Balance,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct RewardsClaimed {
        #[ink(topic)]
        staker: AccountId,
        amount: Balance,
        timestamp: u64,
    }

    impl AdvancedStakingPool {
        #[ink(constructor)]
        pub fn new(
            reward_token: AccountId,
            staking_period: u64,
            reward_rate: u128,
        ) -> Self {
            Self {
                total_staked: 0,
                staking_period,
                reward_rate,
                stakers: Mapping::default(),
                pool_owner: Self::env().caller(),
                reward_token,
                last_update: Self::env().block_timestamp(),
            }
        }

        #[ink(message)]
        pub fn stake(&mut self, amount: Balance) -> Result<(), StakingError> {
            let caller = self.env().caller();
            
            if amount == 0 {
                return Err(StakingError::InvalidAmount);
            }

            // Update rewards before staking
            self.update_rewards(&caller);

            let mut staker_info = self.stakers.get(&caller).unwrap_or(StakerInfo {
                amount: 0,
                reward_debt: 0,
                last_stake_time: 0,
            });

            staker_info.amount += amount;
            staker_info.last_stake_time = self.env().block_timestamp();
            staker_info.reward_debt = (staker_info.amount * self.total_staked) / 1_000_000;

            self.stakers.insert(&caller, &staker_info);
            self.total_staked += amount;

            self.env().emit_event(Staked {
                staker: caller,
                amount,
                timestamp: self.env().block_timestamp(),
            });

            Ok(())
        }

        #[ink(message)]
        pub fn unstake(&mut self, amount: Balance) -> Result<Balance, StakingError> {
            let caller = self.env().caller();
            
            let mut staker_info = self.stakers.get(&caller)
                .ok_or(StakingError::NotStaking)?;

            if amount > staker_info.amount {
                return Err(StakingError::InsufficientStake);
            }

            // Update rewards before unstaking
            self.update_rewards(&caller);

            let rewards = self.calculate_rewards(&caller);
            staker_info.amount -= amount;
            staker_info.reward_debt = (staker_info.amount * self.total_staked) / 1_000_000;

            if staker_info.amount == 0 {
                self.stakers.remove(&caller);
            } else {
                self.stakers.insert(&caller, &staker_info);
            }

            self.total_staked -= amount;

            self.env().emit_event(Unstaked {
                staker: caller,
                amount,
                rewards,
                timestamp: self.env().block_timestamp(),
            });

            Ok(rewards)
        }

        #[ink(message)]
        pub fn claim_rewards(&mut self) -> Result<Balance, StakingError> {
            let caller = self.env().caller();
            
            self.update_rewards(&caller);
            
            let rewards = self.calculate_rewards(&caller);
            if rewards == 0 {
                return Err(StakingError::NoRewards);
            }

            let mut staker_info = self.stakers.get(&caller)
                .ok_or(StakingError::NotStaking)?;
            
            staker_info.reward_debt = (staker_info.amount * self.total_staked) / 1_000_000;
            self.stakers.insert(&caller, &staker_info);

            self.env().emit_event(RewardsClaimed {
                staker: caller,
                amount: rewards,
                timestamp: self.env().block_timestamp(),
            });

            Ok(rewards)
        }

        #[ink(message)]
        pub fn get_staked_amount(&self, staker: AccountId) -> Balance {
            self.stakers.get(&staker).map(|info| info.amount).unwrap_or(0)
        }

        #[ink(message)]
        pub fn get_pending_rewards(&self, staker: AccountId) -> Balance {
            self.calculate_rewards(&staker)
        }

        #[ink(message)]
        pub fn get_total_staked(&self) -> Balance {
            self.total_staked
        }

        #[ink(message)]
        pub fn get_apy(&self) -> u128 {
            self.reward_rate
        }

        fn update_rewards(&mut self, staker: &AccountId) {
            // Update global reward pool
            let time_passed = self.env().block_timestamp() - self.last_update;
            if time_passed > 0 && self.total_staked > 0 {
                let new_rewards = (self.total_staked * self.reward_rate * time_passed as u128) / (365 * 24 * 60 * 60 * 1000);
                // In a real implementation, you would update the reward pool here
            }
            self.last_update = self.env().block_timestamp();
        }

        fn calculate_rewards(&self, staker: &AccountId) -> Balance {
            let staker_info = match self.stakers.get(staker) {
                Some(info) => info,
                None => return 0,
            };

            if staker_info.amount == 0 {
                return 0;
            }

            let time_passed = self.env().block_timestamp() - staker_info.last_stake_time;
            let rewards = (staker_info.amount * self.reward_rate * time_passed as u128) / (365 * 24 * 60 * 60 * 1000);
            
            rewards
        }
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[ink::scale_derive(TypeInfo)]
    pub enum StakingError {
        InvalidAmount,
        InsufficientStake,
        NotStaking,
        NoRewards,
        StakingPeriodNotMet,
        TransferFailed,
    }
}
