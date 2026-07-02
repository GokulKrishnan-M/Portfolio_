import { useEffect } from 'react';

export const CustomCursor = ({
	size = 36,
}: { size?: number }) => {
	useEffect(() => {
		if (window.matchMedia('(pointer: coarse)').matches) {
			return;
		}

		const normalSvg = `
			<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stop-color="#60a5fa"/>
						<stop offset="100%" stop-color="#3b82f6"/>
					</linearGradient>
				</defs>
				<polygon points="4,4 ${size - 4},${size / 2} ${size / 2},${size / 2} ${size / 2},${size - 4} 4,4" fill="url(#grad)" stroke="#1e293b" stroke-width="2"/>
			</svg>`;

		const activeSvg = `
			<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stop-color="#38bdf8"/>
						<stop offset="100%" stop-color="#2563eb"/>
					</linearGradient>
				</defs>
				<polygon points="4,4 ${size - 4},${size / 2} ${size / 2},${size / 2} ${size / 2},${size - 4} 4,4" fill="url(#grad)" stroke="#60a5fa" stroke-width="3"/>
			</svg>`;

		const setCursor = (svg: string) => {
			const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
			const cursor = `url("${encoded}") 0 0, auto`;
			document.documentElement.style.cursor = cursor;
			document.body.style.cursor = cursor;
		};

		setCursor(normalSvg);

		const interactiveSelectors = 'button, a, [role="button"], input, textarea, select, label, [tabindex]:not([tabindex="-1"])';
		let isHoveringInteractive = false;
		let isPointerDown = false;

		const syncCursor = () => {
			setCursor(isPointerDown || isHoveringInteractive ? activeSvg : normalSvg);
		};

		const handlePointerOver = (event: MouseEvent) => {
			if (!(event.target instanceof Element)) return;
			isHoveringInteractive = !!event.target.closest(interactiveSelectors);
			syncCursor();
		};

		const handlePointerOut = (event: MouseEvent) => {
			if (!(event.relatedTarget instanceof Element)) {
				isHoveringInteractive = false;
				syncCursor();
				return;
			}

			isHoveringInteractive = !!event.relatedTarget.closest(interactiveSelectors);
			syncCursor();
		};

		const handlePointerDown = () => {
			isPointerDown = true;
			syncCursor();
		};

		const handlePointerUp = () => {
			isPointerDown = false;
			syncCursor();
		};

		document.addEventListener('mouseover', handlePointerOver);
		document.addEventListener('mouseout', handlePointerOut);
		window.addEventListener('mousedown', handlePointerDown);
		window.addEventListener('mouseup', handlePointerUp);

		return () => {
			document.documentElement.style.cursor = '';
			document.body.style.cursor = '';
			document.removeEventListener('mouseover', handlePointerOver);
			document.removeEventListener('mouseout', handlePointerOut);
			window.removeEventListener('mousedown', handlePointerDown);
			window.removeEventListener('mouseup', handlePointerUp);
		};
	}, [size]);

	return null;
};
