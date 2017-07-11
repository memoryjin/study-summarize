// 赋予dom元素在容器内拖曳的能力
const drag = function(containerSelector='body', moveSelector) {
	let mousedown = false;
	let diffX, diffY;
	const moveEle = document.querySelector(moveSelector);
	const containerEle = document.querySelector(containerSelector);
	moveEle.style.position = 'absolute';
	if(getComputedStyle(containerEle).position === 'static') {
		containerEle.style.position = 'relative';
	}

	const getCanMoveArea = function() {
		const maxLeft = containerEle.offsetWidth - moveEle.offsetWidth - parseInt(getComputedStyle(containerEle)['border-width']) * 2;
		const maxTop = containerEle.offsetHeight - moveEle.offsetHeight - parseInt(getComputedStyle(containerEle)['border-width']) * 2;
		return [maxLeft, maxTop];
	}
	let [maxLeft, maxTop] = getCanMoveArea();				

	const activateMove = function(e) {
		mousedown = true;
		diffX = e.clientX - moveEle.getBoundingClientRect().left;
		diffY = e.clientY - moveEle.getBoundingClientRect().top;
	}
	const cancelMove = function() {
		mousedown = false;
	}

	const move = function(e) {
		if(mousedown) {
			let left = e.clientX - containerEle.getBoundingClientRect().left - diffX - parseInt(getComputedStyle(containerEle)['border-width']);
			let top = e.clientY - containerEle.getBoundingClientRect().top - diffY - parseInt(getComputedStyle(containerEle)['border-width']);
			if(left >= 0 && left <= maxLeft) {
				moveEle.style.left = left + 'px';
			} else {
				moveEle.style.left = left < 0 ? 0 + 'px' : maxLeft + 'px';
			}
			if(top >= 0 && top <= maxTop) {
				moveEle.style.top = top + 'px';
			} else {
				moveEle.style.top = top < 0 ? 0 + 'px' : maxTop + 'px';
			}					
		}
	}
	moveEle.addEventListener('mousedown', activateMove, false);
	document.addEventListener('mouseup', cancelMove, false);
	document.addEventListener('mousemove', move, false);			

	return {
		enable() {
			moveEle.addEventListener('mousedown', activateMove, false);
			document.addEventListener('mouseup', cancelMove, false);
			document.addEventListener('mousemove', move, false);
		},
		disable() {
			moveEle.removeEventListener('mousedown', activateMove, false);
			document.removeEventListener('mouseup', cancelMove, false);
			document.removeEventListener('mousemove', move, false);			
		}
	}	
}