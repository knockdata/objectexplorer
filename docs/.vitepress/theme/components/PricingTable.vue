<script setup>
import { withBase } from "vitepress"
import PricingSignup from "./PricingSignup.vue"
import { PLANS } from "../data/plans.js"

// What each plan covers, as its card lists it. The numbers are data/plans.js's, the same as the
// product's own (foldone service/plan/features.js; scripts/check_plans.py compares them).
const { free, pro, enterprise } = PLANS

// a limit as a card line: its number, or Unlimited
function limit(value, words) {
	if (value === undefined) {
		return `Unlimited ${words}`
	}
	else {
		return `${value} ${words}`
	}
}

const plans = [
	{
		id: "free",
		name: "Free",
		tagline: "Sufficient for most case",
		price: "€0",
		period: "",
		lifetime: "",
		action: "Download",
		href: "/download",
		includes: "What you get:",
		features: [
			"Preview more than 900 file extensions in place",
			"SQL, charts and notebooks on your machine",
			limit(free.max_cloud_roots_per_provider, "cloud roots per provider"),
			limit(free.max_local_folders, "local folders"),
			`${free.max_pii_columns} PII column rules and ${free.max_pii_text_rules} full-text rules`,
			`${free.audit_retention_days} days of audit log history`,
			`${free.support} support`,
		],
	},
	{
		id: "pro",
		name: "Pro",
		tagline: "For the window you leave open all day",
		price: "€20",
		period: "per month",
		lifetime: "€300",
		includes: "Everything in Free and:",
		buy: "mailto:rockie@knockdata.com?subject=ObjectExplorer%20Pro",
		features: [
			limit(pro.max_cloud_roots_per_provider, "cloud roots per provider"),
			limit(pro.max_local_folders, "local folders"),
			"Unlimited PII column and full-text rules",
			`${pro.audit_retention_days} days of audit log history`,
			"Best-effort support",
		],
	},
	{
		id: "enterprise",
		name: "Enterprise",
		tagline: "Most secure, custom support",
		price: "Contact sales",
		period: "",
		lifetime: "",
		action: "Contact sales",
		href: "mailto:rockie@knockdata.com?subject=ObjectExplorer%20Enterprise",
		includes: "Everything in Pro and:",
		features: [
			"Single sign-on, OIDC & SAML",
			"Hardware-bound encryption",
			limit(enterprise.audit_retention_days, "audit log history"),
			`Support within ${enterprise.support}`,
		],
	},
]

// a page of this site goes through the base the build is rooted at; a mailto link does not
function linkOf(href) {
	if (href.startsWith("/")) {
		return withBase(href)
	}
	else {
		return href
	}
}
</script>

<template>
	<div class="pricing">
		<h1>Pricing</h1>
		<p class="pricing-lede">Every plan runs on your machine. Your objects never pass through us, whichever plan you are on.</p>

		<div class="pricing-plans">
			<div v-for="plan in plans" :key="plan.id" class="pricing-plan" :class="`pricing-plan-${plan.id}`">
				<div class="pricing-plan-head">
					<h2>{{ plan.name }}</h2>
					<p class="pricing-tagline">{{ plan.tagline }}</p>
					<p class="pricing-price">{{ plan.price }}<span v-if="plan.period"> {{ plan.period }}</span><template v-if="plan.lifetime"><span>/</span> {{ plan.lifetime }}<span>lifetime</span></template></p>
					<PricingSignup v-if="plan.id === 'pro'" />
					<p v-if="plan.buy" class="pricing-buy">The sign-up starts seven days of Pro. To buy it, <a :href="plan.buy">contact us</a>.</p>
					<a v-else class="pricing-action" :href="linkOf(plan.href)">{{ plan.action }}</a>
				</div>
				<div class="pricing-plan-features">
					<p class="pricing-includes">{{ plan.includes }}</p>
					<ul>
						<li v-for="feature in plan.features" :key="feature">
							<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M20 6 9 17l-5-5" />
							</svg>
							{{ feature }}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
/* the site's one frame (landing.css), so the title and the plans sit on the header's edges */
.pricing {
	margin: 0 auto;
	max-width: var(--landing-width);
	padding: 48px var(--landing-gutter) 96px;
}

.pricing h1 {
	color: var(--vp-c-text-1);
	font-size: 36px;
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.2;
	margin: 0 0 12px;
}

.pricing-lede {
	color: var(--vp-c-text-2);
	font-size: 17px;
	line-height: 1.6;
	margin: 0 0 40px;
}

/* Each card spans two rows of the outer grid and shares them (subgrid), so the buttons and the
   feature lists line up across the three cards. */
.pricing-plans {
	display: grid;
	gap: 18px;
	grid-template-columns: minmax(0, 1fr);
}

.pricing-plan {
	background: var(--vp-c-bg-soft);
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	display: grid;
	gap: 0;
	grid-row: span 2;
	grid-template-rows: subgrid;
}

.pricing-plan-pro {
	/* border-color: var(--vp-c-brand-1); */
	box-shadow: 0 0 40px -24px var(--vp-c-brand-1);
}

.pricing-plan-head {
	display: flex;
	flex-direction: column;
	padding: 24px;
}

.pricing-plan h2 {
	color: var(--vp-c-text-1);
	font-size: 22px;
	font-weight: 600;
	line-height: 1.3;
	margin: 0;
}

.pricing-tagline {
	color: var(--vp-c-text-2);
	font-size: 15px;
	line-height: 1.5;
	margin: 4px 0 20px;
}

.pricing-price {
	color: var(--vp-c-text-1);
	font-size: 32px;
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.2;
	margin: 0 0 24px;
}

/* a margin, not a space: the template compiler drops the space at the start of the span */
.pricing-price span {
	color: var(--vp-c-text-2);
	font-size: 15px;
	font-weight: 400;
	letter-spacing: 0;
	margin-left: 6px;
}

/* margin-top auto sends the button to the bottom of the shared row, level with its neighbours */
.pricing-action {
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	color: var(--vp-c-text-1);
	font-size: 15px;
	font-weight: 500;
	margin-top: auto;
	padding: 10px 16px;
	text-align: center;
	text-decoration: none;
	transition: border-color 0.2s, color 0.2s;
}

.pricing-buy {
	color: var(--vp-c-text-2);
	font-size: 13px;
	margin: 8px 0 0;
}

.pricing-action:hover {
	border-color: var(--vp-c-brand-1);
	color: var(--vp-c-brand-1);
}

/* .pricing .pricing-plan-pro .pricing-action {
	background: var(--vp-button-brand-bg);
	border-color: var(--vp-button-brand-border);
	color: var(--vp-button-brand-text);
}

.pricing .pricing-plan-pro .pricing-action:hover {
	background: var(--vp-button-brand-hover-bg);
	color: var(--vp-button-brand-hover-text);
} */

.pricing-plan-features {
	border-top: 1px solid var(--vp-c-divider);
	padding: 20px 24px 24px;
}

.pricing-includes {
	color: var(--vp-c-text-2);
	font-size: 14px;
	font-weight: 600;
	margin: 0 0 12px;
}

.pricing-plan-features ul {
	display: flex;
	flex-direction: column;
	gap: 10px;
	list-style: none;
	margin: 0;
	padding: 0;
}

.pricing-plan-features li {
	align-items: flex-start;
	color: var(--vp-c-text-1);
	display: flex;
	font-size: 15px;
	gap: 10px;
	line-height: 1.5;
}

.pricing-plan-features svg {
	color: var(--vp-c-brand-1);
	flex: none;
	margin-top: 3px;
}

@media (min-width: 768px) {
	.pricing-plans {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}
</style>
