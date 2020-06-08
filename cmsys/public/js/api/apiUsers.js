$(document).ready(() => {
    getUsers();
});

function getUsers() {
    $.ajax({
        type: 'GET',
        url: '/users/api',
        dataType: 'json',
        success: function(data) {
            var users = data.users;
            var photos = data.photos;
            let row = '';
            let i = 0;
            users.forEach(user => {
                let photo = photos[i];
                row += `<tr><td><img src="${photo}" width="230px" height="150px"></td>
                    <td>${user.lastName} ${user.firstName}</td><td>${user.email}</td></tr>`;

                i++;
            });

            $('#tbody').html(row);
        }
    });
};