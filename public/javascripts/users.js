const getUsers = () => {
    fetch('/users/get').then(res => res.json())
                   .then(json => {
                    document.querySelector('ul').innerHTML = json.map(({ _id: id, name }) => `<li>${name} - <span class="delete" data-id="${id}">X</span></li>`).join('');
                   });
};

const addUser = () => {
    const { value: name } = document.querySelector('#txtName');
    fetch('/users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
               name 
            }
        })
    })
    .then(res => res.json())
    .then(json => {
        console.log(JSON.stringify(json));
        getUsers();
    })
    .catch(err => console.log(err));
};

const deleteUser = (id) => {
    fetch('/users/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id
        })
    })
    .then(res => res.json())
    .then(json => {
        console.log(JSON.stringify(json));
        getUsers();
    })
    .catch(err => console.log(err));
};

document.addEventListener('DOMContentLoaded', () => {
    getUsers();
    document.querySelector('.add').addEventListener('click', addUser);
});

document.addEventListener('click', ({ target }) => {
    if (target.matches('.delete')) {
        const { dataset: { id } } = target;
        deleteUser(id);
    }
});
