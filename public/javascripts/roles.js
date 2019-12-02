const getRoles = () => {
    fetch('/roles/get').then(res => res.json())
                   .then(json => {
                    document.querySelector('ul').innerHTML = json.map(({ _id: id, name, desc }) => `<li>${name} - ${desc} - <span class="delete" data-id="${id}">X</span></li>`).join('');
                   });
};

const addRole = () => {
    const { value: name } = document.querySelector('#txtName');
    const { value: desc } = document.querySelector('#txtDesc');
    fetch('/roles/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            role: {
               name,
               desc 
            }
        })
    })
    .then(res => res.json())
    .then(json => {
        console.log(JSON.stringify(json));
        getRoles();
    })
    .catch(err => console.log(err));
};

const deleteRole = (id) => {
    fetch('/roles/delete', {
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
        getRoles();
    })
    .catch(err => console.log(err));
};

document.addEventListener('DOMContentLoaded', () => {
    getRoles();
    document.querySelector('.add').addEventListener('click', addRole);
});

document.addEventListener('click', ({ target }) => {
    if (target.matches('.delete')) {
        const { dataset: { id } } = target;
        deleteRole(id);
    }
});
