declare function init({ duration, progress, wasmPath, }: {
    duration: number;
    progress: number;
    wasmPath: string;
}): Promise<void>;
declare function pause(): void;
declare function play(): void;
declare function getProgress(): number;
declare const _default: {
    init: typeof init;
    play: typeof play;
    pause: typeof pause;
    getProgress: typeof getProgress;
};
export default _default;
