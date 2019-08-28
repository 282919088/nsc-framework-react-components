import Store from './Store';

class PageStore extends Store {

    //分页信息
    pagination = null;

    setData(data) {
        this.pagination = {
            total: Number(data.total),
            pageSize: Number(data.size),
            current: Number(data.current),
        };
        super.setData(data.records);
    }

    getPagination() {
        return this.pagination;
    }
}

export default PageStore;