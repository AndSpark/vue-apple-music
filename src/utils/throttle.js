function throttle (fn,  delay = 1000) {
	let timer = null;
	let firstTime = true;

	return function (...args) {
			if (firstTime) {
				// 第一次加载
					fn.apply(this, args);
					return firstTime = false;
			}
			if (timer) {
				// 定时器正在执行中，跳过
					return;
			}
			timer = setTimeout(() => {
					clearTimeout(timer);
					timer = null;
					fn.apply(this, args);
			},  delay);
	};
}


export {throttle}