(function () {
	//  configuration

	const config = {
		scrollThresholds: [25, 50, 100],
		scrollColors: ["#ff6347", "#ffa500", "#32cd32"],
		textColor: ["#000", "#333", "#fff"],
		scrollDebounceTime: 100,
		mutationThrottleTime: 300,
		testVariation: "Article and infinite feed optimized:",
	};

	// scrollOffsetFlags
	const scrollOffsetFlags = config.scrollThresholds.reduce((acc, threshold) => {
		acc[`reached${threshold}`] = false;
		return acc;
	}, {});

	// Create the progress bar
	function createProgressBar() {
		const bar = document.createElement("div");
		bar.classList.add("augustine-scroll-progress-bar-ii");
		document.body.appendChild(bar);

		// css for progress bar
		const style = document.createElement("style");
		style.textContent = `
        .augustine-scroll-progress-bar-ii {
            --scroll: 0%;
            background: linear-gradient(to right, ${config.scrollColors[0]} var(--scroll), transparent 0);
            position: fixed;
            width: 100%;
            height: auto;
            top: 300px;
            z-index: 100000;
            text-align: left;
            font-weight: bolder;
            font-size: 1rem;
            color: #ff2e4c;
            padding: 10px;
        }
    `;

		bar.setAttribute("role", "progressbar");
		bar.setAttribute("aria-valuemin", 0);
		bar.setAttribute("aria-valuemax", 100);

		document.head.appendChild(style);

		return bar;
	}

	const progressBar = createProgressBar();

	// utility functions

	function debounce(func, wait) {
		let timeout;
		return function (...args) {
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				func.apply(this, args);
			}, wait);
		};
	}

	function throttle(func, wait) {
		let timerId = null;
		let lastArgs = null;

		function setTimer() {
			if (lastArgs) {
				func.apply(this, lastArgs);
				lastArgs = null;
				timerId = setTimeout(setTimer, wait);
			} else {
				timerId = null;
			}
		}

		return function (...args) {
			if (!timerId) {
				timerId = setTimeout(setTimer, wait);
			} else {
				lastArgs = args;
			}
		};
	}

	function changeColor(offset) {
		let backgroundColor;
		let color;

		if (offset >= 25 && offset < 50) {
			backgroundColor = config.scrollColors[1];
			color = config.textColor[1];
		} else if (offset >= 50) {
			backgroundColor = config.scrollColors[2];
			color = config.textColor[2];
		} else {
			backgroundColor = config.scrollColors[0];
			color = config.textColor[0];
		}

		progressBar.style.background = `linear-gradient(to right, ${backgroundColor} var(--scroll), transparent 0)`;
		progressBar.style.color = color;
	}

	function dispatchScrollEvent(offsetPercentage) {
		const event = new CustomEvent("scrollOffsetReached", {
			detail: {
				offsetPercentage,
			},
		});

		window.dispatchEvent(event);
	}

	function informUser(offsetPercentage) {
		let span = document.createElement("span");
		span.textContent = `Hey, You at ${offsetPercentage}%`;
		span.style.cssText = `
            position: fixed;
            top: 350px;
            left: 0;
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 10px;
            font-size: 1.5rem;
            z-index: 100000;
        `;
		document.body.appendChild(span);

		setTimeout(() => {
			document.body.removeChild(span);
			span = null;
		}, 1000);
	}

	// Main functions
	function checkScrollOffset(scrollOffset) {
		// reset flags
		config.scrollThresholds.forEach((threshold) => {
			if (scrollOffset < threshold)
				scrollOffsetFlags[`reached${threshold}`] = false;
		});

		// check scroll offset and dispatch event
		config.scrollThresholds.forEach((threshold) => {
			if (scrollOffset >= threshold && !scrollOffsetFlags[`reached${threshold}`]) {
				scrollOffsetFlags[`reached${threshold}`] = true;
			}
			if (scrollOffset === threshold) dispatchScrollEvent(threshold);
		});

		changeColor(scrollOffset);
	}

	function scrollProgress() {
		try {
			const root = document.documentElement || document.body;

			const scrollPosition = root.scrollTop;
			const scrollableArea = root.scrollHeight - root.clientHeight;
			const scrollPercent = (scrollPosition / scrollableArea) * 100;
			const roundedScrollPercent = Math.round(scrollPercent);
			progressBar.style.setProperty("--scroll", scrollPercent + "%");

			progressBar.textContent = `${config.testVariation} ${roundedScrollPercent}%`;

			checkScrollOffset(roundedScrollPercent);
		} catch (error) {
			console.error("Error in scrollProgress", error);
		}
	}

	// Event listeners
	const debouncedScrollProgress = debounce(
		scrollProgress,
		config.scrollDebounceTime
	);

	document.addEventListener("scroll", debouncedScrollProgress);

	window.addEventListener("scrollOffsetReached", (event) => {
		const offsetPercentage = event.detail.offsetPercentage;
		if (scrollOffsetFlags[`reached${offsetPercentage}`]) {
			informUser(offsetPercentage);
		}
	});

	// MutationObser setup
	function onMutation(mutations) {
		debouncedScrollProgress();
	}

	const throttledMutations = throttle(onMutation, config.mutationThrottleTime);

	const observer = new MutationObserver(throttledMutations);

	const pageBody = document.querySelector("#pageBody");

	if (pageBody) {
		observer.observe(pageBody, {
			childList: true,
			subtree: true,
			attributes: false,
		});
	} else {
		console.error("Article content not found");
	}

	// Initialize
	scrollProgress();
})();