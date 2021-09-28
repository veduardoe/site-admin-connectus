import { MatPaginatorIntl } from '@angular/material/paginator';

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `No results to show`; }

    const mod = length % pageSize;
    const div = String(length / pageSize);
    const numPages = (mod > 0) ? parseInt(div) + 1 : parseInt(div)
    return `PAGE ${page + 1} OF ${numPages} WITH ${length} ITEMS`;
}


export function getPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = 'ITEMS PER PAGE';
    paginatorIntl.nextPageLabel = null;
    paginatorIntl.lastPageLabel = null;
    paginatorIntl.firstPageLabel = null
    paginatorIntl.previousPageLabel = null;
    paginatorIntl.getRangeLabel = spanishRangeLabel;

    return paginatorIntl;
}