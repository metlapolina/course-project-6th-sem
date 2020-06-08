$(document).ready(() => {
    getTrainers();
    $(document).on('click', '.info', infoTrainer);
    $(document).on('click', '.edit', editTrainer);
    $(document).on('click', '.delete', removeTrainer);
    $(document).on('submit', '#addTrainer', addTrainer);
    $(document).on('submit', '#editTrainer', updateTrainer);
    $(document).on('submit', '#deleteModel', deleteTrainer);
});

function getTrainers() {
    $.ajax({
        type: 'GET',
        url: '/trainers/admin/api',
        dataType: 'json',
        success: function(data) {
            var trainers = data.trainers;
            var users = data.users;
            var photos = data.photos;
            let row = '';
            let card = '';
            let i = 0;
            trainers.forEach(trainer => {
                let photo = photos[i];
                row += `<tr><td><img src="${photo}" width="230px" height="150px"></td>
                    <td>${trainer.user.lastName} ${trainer.user.firstName}</td>
                    <td>${trainer.position}</td><td>${trainer.department}</td><td>${trainer.info}</td>
                    <td><div class="row border-0 ml-1"><a href="#" data-url="/trainers/${trainer._id}/edit" class="edit btn-sm btn-success text-white mr-2"><i class="fa fa-pencil"></i></a>
                    <button data-toggle="modal" data-target="#deleteModal" data-url="/trainers/${trainer._id}" class="delete btn btn-danger p-0" style="width: 70px;height: 30px;" type="button">Delete</button></div></td></tr>`;

                card += `<div class="card mb-3" style="width: 260px; height: 250px;">
                <div class="card-body text-center">
                    <div class="photo mb-2">
                        <img class="avatar" src="${photo}">
                    </div>
                    <h4 class="card-title">
                        ${trainer.user.lastName} ${trainer.user.firstName}
                    </h4>
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${trainer.department}
                    </h6>
                    <a href="#" data-url="/trainers/${trainer._id}" class="info btn btn-outline-info">View Profile</a>
                </div>
            </div>`;
                i++;
            });

            let option = '';
            users.forEach(user => {
                option += '<option value="' + user._id + '">' + user.lastName + ' ' + user.firstName + '</option>';
            });

            $('.content').html(card);
            $('#users').html(option);
            $('#tbody').html(row);
        }
    });
};

function infoTrainer() {
    $.ajax({
        type: "GET",
        url: $(this).data("url"),
        dataType: 'json',
        success: function(data) {
            var trainer = data.trainer;
            var photo = data.photo;
            var courses = data.courses;
            $('.modal-title').text(`${trainer.user.lastName} ${trainer.user.firstName}`);
            $('#photo').attr('src', photo);
            $('#position').text(`${trainer.position} / ${trainer.department}`);
            $('#info').text(trainer.info);
            let coursesList = '';
            if (courses.length > 0) {
                coursesList += '<div class="list-group">';
                courses.forEach(course => {
                    coursesList += '<a href="/courses/' + course._id + '" class="list-group-item list-group-item-action">' + course.title + '</a>';
                });
                coursesList += '</div>';
            }
            $('#courses').html(coursesList);
            $('#myModal').modal('show');

        }
    });
};

function addTrainer(event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            userId: $('#users').val(),
            position: $('#addPosition').val(),
            department: $('#addDepartment').val(),
            info: $('#addInfo').val()
        }),
        success: function(data) {
            $('#addModal').modal('hide');
            getTrainers();
            $('#addTrainer')[0].reset();
        }
    });
};

function editTrainer() {
    $.ajax({
        type: "GET",
        url: $(this).data("url"),
        dataType: 'json',
        success: function(trainer) {
            $('#editTrainer').attr('action', `/trainers/${trainer._id}`);
            $('#id').val(trainer._id);
            $('#userId').val(trainer.user._id);
            $('#lastName').val(trainer.user.lastName);
            $('#firstName').val(trainer.user.firstName);
            $('#email').val(trainer.user.email);
            $('#position').val(trainer.position);
            $('#department').val(trainer.department);
            $('#info').val(trainer.info);
            $('#editModal').modal('show');
        }
    });
};

function updateTrainer(event) {
    event.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        contentType: "application/json; charset=utf-8",
        type: 'PUT',
        data: JSON.stringify({
            id: $('#id').val(),
            userId: $('#userId').val(),
            lastName: $('#lastName').val(),
            firstName: $('#firstName').val(),
            email: $('#email').val(),
            position: $('#position').val(),
            department: $('#department').val(),
            info: $('#info').val()
        }),
        success: function(res) {
            $('#editModal').modal('hide');
            getTrainers();
            $('#editTrainer')[0].reset();
        }
    });
};

var del_url = '';

function removeTrainer() {
    del_url = $(this).data("url");
}

function deleteTrainer() {
    event.preventDefault();
    $.ajax({
        url: del_url,
        method: "DELETE",
        success: function(data) {
            $('#deleteModal').modal('hide');
            getTrainers();
        },
        error: function(jxqr, error, status) {
            console.log();
        }
    });
}