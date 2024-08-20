export const GROUP_VARIANTS = {
    chapter: [
        'group/chapter',
        'group-data-[expanded=true]/chapter:bg-pzh-blue-500',
    ],
    division: [
        'group/division',
        'group-data-[expanded=true]/division:bg-pzh-blue-500',
    ],
    article: [
        'group/article',
        'group-data-[expanded=true]/article:bg-pzh-blue-500',
    ],
    member: [
        'group/member',
        'group-data-[expanded=true]/member:bg-pzh-blue-500',
    ],
    paragraph: [
        'group/paragraph',
        'group-data-[expanded=true]/paragraph:bg-pzh-blue-500',
    ],
}

export const ORDERED_LIST = {
    alphabetical: 'before:content-[counter(list,lower-alpha)]', // "before:[content:counters(list, '.', lower-alpha)]",
    numeral: 'before:content-[counter(list,decimal)]', // "before:[content:counters(list, '.', decimal)]",
    roman: 'before:content-[counter(list,upper-roman)]', // "before:[content:counters(list, '.', upper-roman)]",
}
