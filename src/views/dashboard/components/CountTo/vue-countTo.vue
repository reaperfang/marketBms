<template>
	<div class="item-amount">
		<div class="box">
			<div class="box-item">
				<div class="box-item-start">千万</div>
				<div class="number-item">{{ eight }}</div>
			</div>

			<div class="box-item">
				<div class="box-item-start">百万</div>
				<div class="number-item">{{ seven }}</div>
			</div>
			<div class="box-item flex-end" style="width:5px">
				<span class="semicolon">,</span>
			</div>

			<div class="box-item">
				<div class="box-item-start">十万</div>
				<div class="number-item">{{ six }}</div>
			</div>

			<div class="box-item">
				<div class="box-item-start">万元</div>
				<div class="number-item">{{ five }}</div>
			</div>
			<div class="box-item">
				<div class="box-item-start"></div>
				<div class="number-item">{{ four }}</div>
			</div>
			<div class="box-item flex-end" style="width:5px">
				<span class="semicolon">,</span>
			</div>
			<div class="box-item">
				<div class="box-item-start"></div>
				<div class="number-item">{{ third }}</div>
			</div>
			<div class="box-item">
				<div class="box-item-start"></div>
				<div class="number-item">{{ sec }}</div>
			</div>
			<div class="box-item">
				<div class="box-item-start"></div>
				<div class="number-item">{{ first }}</div>
			</div>
			<div class="box-item flex-end" style="width:5px">
				<span class="point">.</span>
			</div>

			<div class="box-item">
				<div class="box-item-start"></div>
				<div class="number-item">{{ nine }}</div>
			</div>

			<div class="box-item">
				<div class="box-item-start"></div>
				<div class="number-item">{{ last }}</div>
			</div>
		</div>
	</div>
</template>
<script>
import {
	requestAnimationFrame,
	cancelAnimationFrame
} from "./requestAnimationFrame.js";
export default {
	props: {
		startVal: {
			type: Number,
			required: false,
			default: 0
		},
		endVal: {
			type: Number,
			required: false,
			default: 2017
		},
		duration: {
			type: Number,
			required: false,
			default: 3000
		},
		autoplay: {
			type: Boolean,
			required: false,
			default: true
		},
		decimals: {
			type: Number,
			required: false,
			default: 0,
			validator(value) {
				return value >= 0;
			}
		},
		decimal: {
			type: String,
			required: false,
			default: "."
		},
		separator: {
			type: String,
			required: false,
			default: ","
		},
		prefix: {
			type: String,
			required: false,
			default: ""
		},
		suffix: {
			type: String,
			required: false,
			default: ""
		},
		useEasing: {
			type: Boolean,
			required: false,
			default: true
		},
		easingFn: {
			type: Function,
			default(t, b, c, d) {
				return (
					(c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
				);
			}
		}
	},
	data() {
		return {
			localStartVal: this.startVal,
			displayValue: this.formatNumber(this.startVal),
			printVal: null,
			paused: false,
			localDuration: this.duration,
			startTime: null,
			timestamp: null,
			remaining: null,
			rAF: null,
			itemData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			first: 0,
			sec: 0,
			third: 0,
			four: 0,
			five: 0,
			six: 0,
			seven: 0,
			eight: 0,
			nine: 0,
			last: 0
		};
	},
	computed: {
		countDown() {
			return this.startVal > this.endVal;
		}
	},
	watch: {
		startVal() {
			if (this.autoplay) {
				this.start();
			}
		},
		endVal(val) {
			let result = val.toString().split(".");
			if (this.autoplay) {
				this.start();
			}
			this.modifyTotal(result[0], result[1]);
		}
	},
	mounted() {
		if (this.autoplay) {
			this.start();
		}
		this.$emit("mountedCallback");
	},
	methods: {
		start() {
			this.localStartVal = this.startVal;
			this.startTime = null;
			this.localDuration = this.duration;
			this.paused = false;
			this.rAF = requestAnimationFrame(this.count);
		},
		pauseResume() {
			if (this.paused) {
				this.resume();
				this.paused = false;
			} else {
				this.pause();
				this.paused = true;
			}
		},
		pause() {
			cancelAnimationFrame(this.rAF);
		},
		resume() {
			this.startTime = null;
			this.localDuration = +this.remaining;
			this.localStartVal = +this.printVal;
			requestAnimationFrame(this.count);
		},
		reset() {
			this.startTime = null;
			cancelAnimationFrame(this.rAF);
			this.displayValue = this.formatNumber(this.startVal);
		},
		count(timestamp) {
			if (!this.startTime) this.startTime = timestamp;
			this.timestamp = timestamp;
			const progress = timestamp - this.startTime;
			this.remaining = this.localDuration - progress;

			if (this.useEasing) {
				if (this.countDown) {
					this.printVal =
						this.localStartVal -
						this.easingFn(
							progress,
							0,
							this.localStartVal - this.endVal,
							this.localDuration
						);
				} else {
					this.printVal = this.easingFn(
						progress,
						this.localStartVal,
						this.endVal - this.localStartVal,
						this.localDuration
					);
				}
			} else {
				if (this.countDown) {
					this.printVal =
						this.localStartVal -
						(this.localStartVal - this.endVal) *
							(progress / this.localDuration);
				} else {
					this.printVal =
						this.localStartVal +
						(this.endVal - this.localStartVal) *
							(progress / this.localDuration);
				}
			}
			if (this.countDown) {
				this.printVal =
					this.printVal < this.endVal ? this.endVal : this.printVal;
			} else {
				this.printVal =
					this.printVal > this.endVal ? this.endVal : this.printVal;
			}

			this.displayValue = this.formatNumber(this.printVal);
			if (progress < this.localDuration) {
				this.rAF = requestAnimationFrame(this.count);
			} else {
				this.$emit("callback");
			}
		},
		isNumber(val) {
			return !isNaN(parseFloat(val));
		},
		formatNumber(num) {
			num = num.toFixed(this.decimals);
			num += "";
			const x = num.split(".");
			let x1 = x[0];
			const x2 = x.length > 1 ? this.decimal + x[1] : "";
			const rgx = /(\d+)(\d{3})/;
			if (this.separator && !this.isNumber(this.separator)) {
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, "$1" + this.separator + "$2");
				}
			}
			return this.prefix + x1 + x2 + this.suffix;
		},
		modifyTotal(val, decimal) {
			let resutlt = this.reverse(val.toString()); //charAt

			if (resutlt.charAt(0)) {
				this.first = resutlt.charAt(0);
			}
			if (resutlt.charAt(1)) {
				this.sec = resutlt.charAt(1);
			}
			if (resutlt.charAt(2)) {
				this.third = resutlt.charAt(2);
			}
			if (resutlt.charAt(3)) {
				this.four = resutlt.charAt(3);
			}
			if (resutlt.charAt(4)) {
				this.five = resutlt.charAt(4);
			}
			if (resutlt.charAt(5)) {
				this.six = resutlt.charAt(5);
			}
			if (resutlt.charAt(6)) {
				this.seven = resutlt.charAt(6);
			}
			if (resutlt.charAt(7)) {
				this.eight = resutlt.charAt(7);
			}

			if (decimal.charAt(0)) {
				this.nine = decimal.charAt(0);
			}

			if (decimal.charAt(1)) {
				this.last = decimal.charAt(1);
			}
		},
		reverse(str) {
			return str
				.split("")
				.reverse()
				.join("");
		}
	},
	destroyed() {
		cancelAnimationFrame(this.rAF);
	}
};
</script>

<style lang="scss" scoped>
.item-amount {
	height: 97px;
	.box {
		height: 100%;
		margin: 0 20px;
		display: flex;
		justify-content: space-around;

		.flex-end {
			display: flex;
			align-items: flex-end;
		}

		.box-item {
			width: 52px;
			height: 100%;
			// display: flex;
			// align-items: flex-end;

			.box-item-start {
				font-size: 12px;
				font-weight: 500;
				color: #ffffff;
				height: 25%;
				text-align: center;
				padding: 8px 0 0 0;
			}

			.number-item {
				justify-self: end;
				height: 75%;
				width: 52px;
				background: rgba(71, 225, 255, 0.02);
				box-shadow: 0px 1px 20px 0px rgba(71, 225, 255, 0.1) inset;
				//margin-left: 10px;

				font-size: 68px;
				font-weight: bold;
				color: #ffffff;
				background: linear-gradient(180deg, #dafffd 0%, #14e1fc 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;

				text-align: center;
			}
		}

		.point {
			width: 7px;
			height: 7px;
			background: linear-gradient(180deg, #dafffd 0%, #14e1fc 100%);
			border-radius: 50%;
		}

		.semicolon {
			// width: 10px;
			height: 10px;
			justify-self: end;
			background: linear-gradient(180deg, #dafffd 0%, #14e1fc 100%);
		}
	}
}
</style>
