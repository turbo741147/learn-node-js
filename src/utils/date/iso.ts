export function iso(value: Date | string) {
    if (value instanceof Date) return value.toISOString();
    return new Date(value).toISOString();
}
