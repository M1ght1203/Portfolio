export class CarouselController {
    constructor(element, options = {}) {
        this.element = element || null;
        this.options = {
            itemSelector: options.itemSelector || '.carousel-item',
            autoScrollInterval: options.autoScrollInterval || 5000,
            userInactivityDelay: options.userInactivityDelay || 1000,
            motionPreferenceQuery: options.motionPreferenceQuery || '(prefers-reduced-motion: reduce)',
        };

        this.items = [];
        this.currentIndex = 0;
        this.isUserInteracting = false;
        this.dragState = { active: false, startX: 0, startScrollLeft: 0, pointerId: null };
        this.autoScrollTimeout = null;
        this.userScrollTimeout = null;
        this.scrollUpdateFrame = null;
        this.motionPreferenceQuery = null;

        this.handleScroll = this.handleScroll.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMotionPreferenceChange = this.handleMotionPreferenceChange.bind(this);
    }

    init() {
        if (!this.element) {
            return false;
        }

        this.items = Array.from(this.element.querySelectorAll(this.options.itemSelector));
        if (!this.items.length) {
            return false;
        }

        this.currentIndex = 0;
        this.isUserInteracting = false;

        this.element.addEventListener('scroll', this.handleScroll, { passive: true });
        this.element.addEventListener('mouseenter', this.handleMouseEnter);
        this.element.addEventListener('mouseleave', this.handleMouseLeave);

        this.initializePointerHandlers();

        if (window.matchMedia) {
            this.motionPreferenceQuery = window.matchMedia(this.options.motionPreferenceQuery);
            if (this.motionPreferenceQuery.addEventListener) {
                this.motionPreferenceQuery.addEventListener('change', this.handleMotionPreferenceChange);
            } else if (this.motionPreferenceQuery.addListener) {
                this.motionPreferenceQuery.addListener(this.handleMotionPreferenceChange);
            }
        }

        this.scheduleAutoScroll();
        return true;
    }

    destroy() {
        this.element?.removeEventListener('scroll', this.handleScroll);
        this.element?.removeEventListener('mouseenter', this.handleMouseEnter);
        this.element?.removeEventListener('mouseleave', this.handleMouseLeave);

        this.teardownPointerHandlers();

        if (this.motionPreferenceQuery) {
            if (this.motionPreferenceQuery.removeEventListener) {
                this.motionPreferenceQuery.removeEventListener('change', this.handleMotionPreferenceChange);
            } else if (this.motionPreferenceQuery.removeListener) {
                this.motionPreferenceQuery.removeListener(this.handleMotionPreferenceChange);
            }
            this.motionPreferenceQuery = null;
        }

        clearTimeout(this.autoScrollTimeout);
        clearTimeout(this.userScrollTimeout);
        this.autoScrollTimeout = null;
        this.userScrollTimeout = null;

        if (this.scrollUpdateFrame) {
            cancelAnimationFrame(this.scrollUpdateFrame);
            this.scrollUpdateFrame = null;
        }
    }

    refresh() {
        this.items = Array.from(this.element?.querySelectorAll(this.options.itemSelector) || []);
        this.currentIndex = Math.min(this.currentIndex, Math.max(this.items.length - 1, 0));
        this.scheduleAutoScroll();
    }

    goToIndex(index) {
        if (!this.items.length || !this.element) return;

        this.currentIndex = (index + this.items.length) % this.items.length;
        const target = this.items[this.currentIndex];
        if (!target) return;

        this.element.scrollTo({
            left: target.offsetLeft,
            behavior: 'smooth',
        });
    }

    next() {
        this.goToIndex(this.currentIndex + 1);
    }

    previous() {
        this.goToIndex(this.currentIndex - 1);
    }

    initializePointerHandlers() {
        if (!this.element) return;

        if (window.PointerEvent) {
            this.pointerDownHandler = event => {
                if (this.dragState.active) return;
                if (event.pointerType === 'mouse' && event.button !== 0) return;

                event.preventDefault();
                this.startDrag(event.clientX, event.pointerId);

                const moveHandler = this.createPointerMoveHandler();
                const endHandler = this.createPointerEndHandler(moveHandler);

                this.pointerMoveHandler = moveHandler;
                this.pointerEndHandler = endHandler;

                window.addEventListener('pointermove', moveHandler, { passive: false });
                window.addEventListener('pointerup', endHandler);
                window.addEventListener('pointercancel', endHandler);
            };

            this.element.addEventListener('pointerdown', this.pointerDownHandler);
        } else {
            this.mouseDownHandler = event => {
                if (this.dragState.active) return;
                if (event.button !== 0) return;

                event.preventDefault();
                this.startDrag(event.clientX);

                this.mouseMoveHandler = moveEvent => {
                    moveEvent.preventDefault();
                    this.moveDrag(moveEvent.clientX);
                };

                this.mouseUpHandler = () => {
                    window.removeEventListener('mousemove', this.mouseMoveHandler);
                    window.removeEventListener('mouseup', this.mouseUpHandler);
                    this.endDrag();
                };

                window.addEventListener('mousemove', this.mouseMoveHandler);
                window.addEventListener('mouseup', this.mouseUpHandler);
            };

            this.touchStartHandler = event => {
                if (this.dragState.active) return;
                if (event.touches.length !== 1) return;

                const touch = event.touches[0];
                if (!touch) return;

                this.startDrag(touch.clientX);

                this.touchMoveHandler = moveEvent => {
                    if (!moveEvent.touches.length) return;
                    const activeTouch = moveEvent.touches[0];
                    if (!activeTouch) return;

                    moveEvent.preventDefault();
                    this.moveDrag(activeTouch.clientX);
                };

                this.touchEndHandler = () => {
                    this.element.removeEventListener('touchmove', this.touchMoveHandler);
                    this.element.removeEventListener('touchend', this.touchEndHandler);
                    this.element.removeEventListener('touchcancel', this.touchEndHandler);
                    this.endDrag();
                };

                this.element.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
                this.element.addEventListener('touchend', this.touchEndHandler);
                this.element.addEventListener('touchcancel', this.touchEndHandler);
            };

            this.element.addEventListener('mousedown', this.mouseDownHandler);
            this.element.addEventListener('touchstart', this.touchStartHandler, { passive: true });
        }
    }

    teardownPointerHandlers() {
        if (!this.element) return;

        if (window.PointerEvent) {
            this.element.removeEventListener('pointerdown', this.pointerDownHandler);
            if (this.pointerMoveHandler) {
                window.removeEventListener('pointermove', this.pointerMoveHandler);
            }
            if (this.pointerEndHandler) {
                window.removeEventListener('pointerup', this.pointerEndHandler);
                window.removeEventListener('pointercancel', this.pointerEndHandler);
            }
            this.pointerDownHandler = null;
            this.pointerMoveHandler = null;
            this.pointerEndHandler = null;
        } else {
            this.element.removeEventListener('mousedown', this.mouseDownHandler);
            this.element.removeEventListener('touchstart', this.touchStartHandler);
            if (this.mouseMoveHandler) {
                window.removeEventListener('mousemove', this.mouseMoveHandler);
            }
            if (this.mouseUpHandler) {
                window.removeEventListener('mouseup', this.mouseUpHandler);
            }
            if (this.touchMoveHandler) {
                this.element.removeEventListener('touchmove', this.touchMoveHandler);
            }
            if (this.touchEndHandler) {
                this.element.removeEventListener('touchend', this.touchEndHandler);
                this.element.removeEventListener('touchcancel', this.touchEndHandler);
            }
            this.mouseDownHandler = null;
            this.mouseMoveHandler = null;
            this.mouseUpHandler = null;
            this.touchStartHandler = null;
            this.touchMoveHandler = null;
            this.touchEndHandler = null;
        }

        this.dragState = { active: false, startX: 0, startScrollLeft: 0, pointerId: null };
    }

    createPointerMoveHandler() {
        return event => {
            if (!this.dragState.active || event.pointerId !== this.dragState.pointerId) return;

            event.preventDefault();
            if (event.pointerType === 'mouse' && event.buttons === 0) {
                this.pointerEndHandler?.(event);
                return;
            }

            this.moveDrag(event.clientX);
        };
    }

    createPointerEndHandler(moveHandler) {
        return event => {
            if (event.pointerId !== this.dragState.pointerId) return;

            window.removeEventListener('pointermove', moveHandler);
            window.removeEventListener('pointerup', this.pointerEndHandler);
            window.removeEventListener('pointercancel', this.pointerEndHandler);
            this.endDrag();
            this.pointerMoveHandler = null;
            this.pointerEndHandler = null;
        };
    }

    startDrag(clientX, pointerId = null) {
        this.isUserInteracting = true;
        clearTimeout(this.autoScrollTimeout);

        this.dragState.active = true;
        this.dragState.startX = clientX;
        this.dragState.startScrollLeft = this.element ? this.element.scrollLeft : 0;
        this.dragState.pointerId = pointerId;
        this.element?.classList.add('is-dragging');
    }

    moveDrag(clientX) {
        if (!this.dragState.active || !this.element) return;

        const deltaX = clientX - this.dragState.startX;
        this.element.scrollLeft = this.dragState.startScrollLeft - deltaX;
    }

    endDrag() {
        if (!this.dragState.active) return;

        this.dragState.active = false;
        this.dragState.pointerId = null;
        this.element?.classList.remove('is-dragging');

        this.isUserInteracting = false;
        this.scheduleAutoScroll();
    }

    handleScroll() {
        this.handleUserScroll();

        if (this.scrollUpdateFrame) return;
        this.scrollUpdateFrame = requestAnimationFrame(() => {
            this.scrollUpdateFrame = null;
            this.updateIndexFromScroll();
        });
    }

    handleUserScroll() {
        this.isUserInteracting = true;
        clearTimeout(this.userScrollTimeout);
        this.userScrollTimeout = setTimeout(() => {
            this.isUserInteracting = false;
            this.scheduleAutoScroll();
        }, this.options.userInactivityDelay);
    }

    updateIndexFromScroll() {
        if (!this.items.length || !this.element) return;

        const scrollLeft = this.element.scrollLeft;
        let closestIndex = this.currentIndex;
        let minDistance = Infinity;

        this.items.forEach((item, index) => {
            const distance = Math.abs(item.offsetLeft - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        this.currentIndex = closestIndex;
    }

    handleMouseEnter() {
        this.isUserInteracting = true;
        clearTimeout(this.autoScrollTimeout);
    }

    handleMouseLeave() {
        this.isUserInteracting = false;
        this.scheduleAutoScroll();
    }

    scheduleAutoScroll() {
        clearTimeout(this.autoScrollTimeout);
        if (!this.items.length || this.isUserInteracting) {
            return;
        }

        if (this.motionPreferenceQuery?.matches) {
            return;
        }

        this.autoScrollTimeout = setTimeout(() => {
            if (!this.isUserInteracting) {
                this.next();
            }
            this.scheduleAutoScroll();
        }, this.options.autoScrollInterval);
    }

    handleMotionPreferenceChange(event) {
        if (event.matches) {
            clearTimeout(this.autoScrollTimeout);
        } else {
            this.scheduleAutoScroll();
        }
    }
}
