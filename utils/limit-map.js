
const limitMap = (list, limit, iterator, callback) => {
    const cloneList = [...list];
    let length = cloneList.length;
    const queue = cloneList.splice(0, limit);
    let complete = 0;

    const iteratorCallback = () => {
        complete++;
        if (length === complete) {
            return callback(queue);
        }
        if (cloneList.length > 0) {
            const [firstItem] = cloneList.splice(0, 1);
            queue.push(firstItem);
            iterator(firstItem, iteratorCallback);
        }
    }

    queue.map((item) => {
        iterator(item, iteratorCallback);
    });
}

module.exports = limitMap;
