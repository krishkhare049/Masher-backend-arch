export function maxLengthNameWithSuffix (name, length, showSuffixAfterLength){
    const slicedName = name.length > length
        ? name.slice(0, showSuffixAfterLength) + "..."
        : name

        return slicedName;
}