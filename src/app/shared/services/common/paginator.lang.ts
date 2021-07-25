import { MatPaginatorIntl } from '@angular/material/paginator';

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `Sin resultados para mostrar`; }

    const mod = length % pageSize;
    const div = String(length / pageSize);
    const numPages = (mod > 0) ? parseInt(div) + 1 : parseInt(div)
    return `PÁGINA ${page + 1} DE ${numPages} EN UN TOTAL DE ${length} REGISTROS`;
}


export function getPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = 'REGISTROS POR PÁGINA';
    paginatorIntl.nextPageLabel = null;
    paginatorIntl.lastPageLabel = null;
    paginatorIntl.firstPageLabel = null
    paginatorIntl.previousPageLabel = null;
    paginatorIntl.getRangeLabel = spanishRangeLabel;

    return paginatorIntl;
}