const getUsers = () => {
    fetch('/users/get').then(res => res.json())
                   .then(json => {
                    document.querySelector('ul').innerHTML = json.map(({ name }) => `<li>${name}</li>`).join('');
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
    .then(() => {
        getUsers();
    })
    .catch(err => alert(err));
};

document.addEventListener('DOMContentLoaded', () => {
    getUsers();
    document.querySelector('.add').addEventListener('click', addUser);
});
