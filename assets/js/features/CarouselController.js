export class CarouselController {
    constructor(carousel) {
        this.carousel = carousel;
        this.items = Array.from(carousel?.querySelectorAll('.carousel-item') || []);
        this.dragState = {
            active: false,
            startX: 0,
            startScrollLeft: 0,
            pointerId: null,
        };
        this.currentIndex = 0;
        this.isUserInteracting = false;
        this.autoScrollTimeout = null;
        this.userScrollTimeout = null;
        this.scrollUpdateFrame = null;
        this.motionPreferenceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
        this.prefersReducedMotion = this.motionPreferenceQuery || { matches: false };
    }

    init() {
        if (!this.carousel || !this.items.length) {
            return;
        }

        this.bindCarouselEvents();
        this.bindInputHandlers();
        this.scheduleAutoScroll();
    }

    bindCarouselEvents() {
        this.carousel.addEventListener('scroll', () => {
            if (!this.scrollUpdateFrame) {
                this.scrollUpdateFrame = window.requestAnimationFrame(() => this.updateIndexFromScroll());
            }
            this.handleUserScroll();
        });

        this.carousel.addEventListener('mouseenter', () => {
            this.isUserInteracting = true;
            window.clearTimeout(this.autoScrollTimeout);
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.isUserInteracting = false;
            this.scheduleAutoScroll();
        });

        if (this.motionPreferenceQuery) {
            const handler = event => {
                if (event.matches) {
                    window.clearTimeout(this.autoScrollTimeout);
                } else {
                    this.scheduleAutoScroll();
                }
            };

            if (this.motionPreferenceQuery.addEventListener) {
                this.motionPreferenceQuery.addEventListener('change', handler);
            } else if (this.motionPreferenceQuery.addListener) {
                this.motionPreferenceQuery.addListener(handler);
            }
        }
    }

    bindInputHandlers() {
        if (window.PointerEvent) {
            this.attachPointerHandlers();
        } else {
            this.attachMouseHandlers();
            this.attachTouchHandlers();
        }
    }

    attachPointerHandlers() {
        const pointerMoveOptions = { passive: false };

        const handlePointerMove = event => {
            if (!this.dragState.active || event.pointerId !== this.dragState.pointerId) {
                return;
            }

            event.preventDefault();
            if (event.pointerType === 'mouse' && event.buttons === 0) {
                handlePointerEnd(event);
                return;
            }

            this.moveDrag(event.clientX);
        };

        const handlePointerEnd = event => {
            if (event.pointerId !== this.dragState.pointerId) {
                return;
            }

            window.removeEventListener('pointermove', handlePointerMove, pointerMoveOptions);
            window.removeEventListener('pointerup', handlePointerEnd);
            window.removeEventListener('pointercancel', handlePointerEnd);
            this.endDrag();
        };

        this.carousel.addEventListener('pointerdown', event => {
            if (this.dragState.active) {
                return;
            }

            if (event.pointerType === 'mouse' && event.button !== 0) {
                return;
            }

            event.preventDefault();
            this.startDrag(event.clientX, event.pointerId);
            window.addEventListener('pointermove', handlePointerMove, pointerMoveOptions);
            window.addEventListener('pointerup', handlePointerEnd);
            window.addEventListener('pointercancel', handlePointerEnd);
        });
    }

    attachMouseHandlers() {
        const handleMouseMove = event => {
            event.preventDefault();
            this.moveDrag(event.clientX);
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            this.endDrag();
        };

        this.carousel.addEventListener('mousedown', event => {
            if (this.dragState.active || event.button !== 0) {
                return;
            }

            event.preventDefault();
            this.startDrag(event.clientX);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        });
    }

    attachTouchHandlers() {
        const handleTouchMove = event => {
            if (!this.dragState.active) {
                return;
            }

            const touch = event.touches[0];
            if (!touch) {
                return;
            }

            event.preventDefault();
            this.moveDrag(touch.clientX);
        };

        const handleTouchEnd = () => {
            this.carousel.removeEventListener('touchmove', handleTouchMove);
            this.carousel.removeEventListener('touchend', handleTouchEnd);
            this.carousel.removeEventListener('touchcancel', handleTouchEnd);
            this.endDrag();
        };

        this.carousel.addEventListener(
            'touchstart',
            event => {
                if (this.dragState.active || event.touches.length !== 1) {
                    return;
                }

                this.startDrag(event.touches[0].clientX);
                this.carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
                this.carousel.addEventListener('touchend', handleTouchEnd);
                this.carousel.addEventListener('touchcancel', handleTouchEnd);
            },
            { passive: true }
        );
    }

    startDrag(clientX, pointerId = null) {
        this.isUserInteracting = true;
        window.clearTimeout(this.autoScrollTimeout);

        this.dragState.active = true;
        this.dragState.startX = clientX;
        this.dragState.startScrollLeft = this.carousel.scrollLeft;
        this.dragState.pointerId = pointerId;
        this.carousel.classList.add('is-dragging');
    }

    moveDrag(clientX) {
        if (!this.dragState.active) {
            return;
        }

        const deltaX = clientX - this.dragState.startX;
        this.carousel.scrollLeft = this.dragState.startScrollLeft - deltaX;
    }

    endDrag() {
        if (!this.dragState.active) {
            return;
        }

        this.dragState.active = false;
        this.dragState.pointerId = null;
        this.carousel.classList.remove('is-dragging');
        this.isUserInteracting = false;
        this.scheduleAutoScroll();
    }

    goToIndex(index) {
        if (!this.items.length) {
            return;
        }

        this.currentIndex = (index + this.items.length) % this.items.length;
        const target = this.items[this.currentIndex];
        if (!target) {
            return;
        }

        this.carousel.scrollTo({
            left: target.offsetLeft,
            behavior: 'smooth',
        });
    }

    scheduleAutoScroll() {
        window.clearTimeout(this.autoScrollTimeout);

        if (this.prefersReducedMotion.matches || this.items.length <= 1) {
            return;
        }

        this.autoScrollTimeout = window.setTimeout(() => {
            if (!this.isUserInteracting) {
                this.goToIndex(this.currentIndex + 1);
            }
            this.scheduleAutoScroll();
        }, 5000);
    }

    handleUserScroll() {
        this.isUserInteracting = true;
        window.clearTimeout(this.userScrollTimeout);
        this.userScrollTimeout = window.setTimeout(() => {
            this.isUserInteracting = false;
            this.scheduleAutoScroll();
        }, 1000);
    }

    updateIndexFromScroll() {
        this.scrollUpdateFrame = null;
        if (!this.items.length) {
            return;
        }

        const scrollLeft = this.carousel.scrollLeft;
        let closestIndex = this.currentIndex;
        let minDistance = Number.POSITIVE_INFINITY;

        this.items.forEach((item, index) => {
            const distance = Math.abs(item.offsetLeft - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        this.currentIndex = closestIndex;
    }
}
