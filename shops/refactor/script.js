fetch('../../api/categories.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('خطا:', error);
    });