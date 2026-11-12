// What each plan allows, as the pricing page (components/PricingTable.vue) lists it. The product's own
// numbers are in foldone's service/plan/features.js, in the same shape: scripts/check_plans.py compares
// the two, so a number changed there fails the check until it is changed here too. undefined means
// unlimited.

const free = {
	max_cloud_roots_per_provider: 5,
	max_local_folders: 10,
	max_pii_columns: 5,
	max_pii_text_rules: 5,
	audit_retention_days: 7,
	hardware_encryption: false,
	support: "Community",
}

const pro = {
	max_cloud_roots_per_provider: undefined,
	max_local_folders: undefined,
	max_pii_columns: undefined,
	max_pii_text_rules: undefined,
	audit_retention_days: 365,
	hardware_encryption: false,
	support: "Best effort",
}

const enterprise = {
	max_cloud_roots_per_provider: undefined,
	max_local_folders: undefined,
	max_pii_columns: undefined,
	max_pii_text_rules: undefined,
	audit_retention_days: undefined,
	hardware_encryption: true,
	support: "1 business day",
}

export const PLANS = { free, pro, enterprise }
