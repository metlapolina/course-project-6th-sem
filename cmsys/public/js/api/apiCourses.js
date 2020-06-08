$(document).ready(() => {
    getCourses();
    $(document).on('click', '.edit', editCourse);
    $(document).on('click', '.delete', removeCourse);
    $(document).on('submit', '#addCourse', addCourse);
    $(document).on('submit', '#editCourse', updateCourse);
    $(document).on('submit', '#deleteModel', deleteCourse);
});

function getCourses() {
    $.ajax({
        type: 'GET',
        url: '/courses/admin/api',
        dataType: 'json',
        success: function(data) {
            var courses = data.courses;
            var trainers = data.trainers;
            var groups = data.groups;
            let row = '';
            courses.forEach(course => {
                row += '<tr><td>' + course.title + '</td><td>' + course.group.title + '</td><td>' + course.type + '</td>' +
                    '<td><div class="row border-0 ml-1"><a href="#" data-url="/courses/' + course._id + '/edit" class="edit btn-sm btn-success text-white mr-2"><i class="fa fa-pencil"></i></a>' +
                    '<button data-toggle="modal" data-target="#deleteModal" data-url="/courses/' + course._id + '" class="delete btn btn-danger p-0" style="width: 70px;height: 30px;" type="button">Delete</button></div></td></tr>';
            });

            let optionTrainer = '';
            trainers.forEach(trainer => {
                optionTrainer += '<option value="' + trainer._id + '">' + trainer.user.lastName + ' ' + trainer.user.firstName + '</option>';
            });

            let optionGroup = '';
            groups.forEach(group => {
                optionGroup += '<option value="' + group._id + '">' + group.title + '</option>';
            });

            $('#addTrainer').html(optionTrainer);
            $('#editTrainer').html(optionTrainer);
            $('#addGroup').html(optionGroup);
            $('#editGroup').html(optionGroup);
            $('#tbody').html(row);
        }
    });
};

function addCourse(event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            title: $('#addTitle').val(),
            type: $('#addType').val(),
            groupId: $('#addGroup').val(),
            trainerId: $('#addTrainer').val(),
            info: $('#addInfo').val()
        }),
        success: function(data) {
            $('#addModal').modal('hide');
            getCourses();
            $('#addCourse')[0].reset();
        }
    });
};

function editCourse() {
    $.ajax({
        type: "GET",
        url: $(this).data("url"),
        dataType: 'json',
        success: function(course) {
            $('#editCourse').attr('action', `/courses/${course._id}`);
            $('#id').val(course._id);
            $('#editTitle').val(course.title);
            $('#editType').val(course.type);
            $('#editGroup').val(course.group);
            $('#editTrainer').val(course.trainer);
            $('#editInfo').val(course.info);

            $('#editModal').modal('show');
        }
    });
};

function updateCourse(event) {
    event.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        contentType: "application/json; charset=utf-8",
        type: 'PUT',
        data: JSON.stringify({
            id: $('#id').val(),
            title: $('#editTitle').val(),
            type: $('#editType').val(),
            groupId: $('#editGroup').val(),
            trainerId: $('#editTrainer').val(),
            info: $('#editInfo').val()
        }),
        success: function(res) {
            $('#editModal').modal('hide');
            getCourses();
            $('#editCourse')[0].reset();
        }
    });
};

var del_url = '';

function removeCourse() {
    del_url = $(this).data("url");
}

function deleteCourse() {
    event.preventDefault();
    $.ajax({
        url: del_url,
        method: "DELETE",
        success: function(data) {
            $('#deleteModal').modal('hide');
            getCourses();
        },
        error: function(jxqr, error, status) {
            console.log(error);
        }
    });
}