export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export function classList(classes: Record<string, boolean>): string {
    return Object
        .entries(classes)
        .filter(entry => entry[1])
        .map(entry => entry[0])
        .join(' ');
}

export function mergeRefs<T>(...refs: React.Ref<T>[]): React.Ref<T> {
    const filteredRefs = refs.filter(Boolean);
    if (!filteredRefs.length) return null;
    if (filteredRefs.length === 0) return filteredRefs[0];
    return inst => {
        for (const ref of filteredRefs) {
            if (typeof ref === 'function') {
                ref(inst);
            } else if (ref) {
                const writableRef = ref as Writable<React.RefObject<T>>;
                writableRef.current = inst;
            }
        }
    };
};