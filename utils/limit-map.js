
const limitMap = (list, limit, iterator, callback) => {
    const cloneList = [...list];
    const queue = cloneList.split(0, limit);
    let complete = 0;
    let length = cloneList.length;

    const iteratorCallback = () => {
        complete++;
        if (length === complete) {
            return callback(queue);
        }
        if (cloneList.length > 0) {
            const firstItem = cloneList.split(0, 1);
            queue.push(firstItem);
            iterator(firstItem, iteratorCallback);
        }
    }

    queue.map((item) => {
        iterator(item, iteratorCallback);
    });
}

export default limitMap;
