$(document).ready(() => {
    getCourseGroups();
    $(document).on('click', '.edit', editCourseGroup);
    $(document).on('click', '.delete', removeCourseGroup);
    $(document).on('submit', '#addCourseGroup', addCourseGroup);
    $(document).on('submit', '#editCourseGroup', updateCourseGroup);
    $(document).on('submit', '#deleteModel', deleteCourseGroup);
});

function getCourseGroups() {
    $.ajax({
        type: 'GET',
        url: '/courseGroups/api',
        dataType: 'json',
        success: function(courseGroups) {
            let row = '';
            courseGroups.forEach(group => {
                row += `<tr>
                <td>
                    ${group.title}
                </td>
                <td>
                    <div class="row border-0 ml-1">
                        <a href="#" data-url="/courseGroups/${group._id}/edit" class="edit btn-sm btn-success text-white mr-2" type="button"><i class="fa fa-pencil"></i></a>
                        <button data-toggle="modal" data-target="#deleteModal" data-url="/courseGroups/${group._id}" class="delete btn btn-danger p-0" style="width: 70px;height: 30px;" type="button">Delete</button>
                    </div>
                </td>
            </tr>`;
            });
            $('#tbody').html(row);
        }
    });
};

function addCourseGroup(event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            title: $('#addTitle').val(),
            cover: $('.filepond--data input').val()
        }),
        success: function(data) {
            $('#addModal').modal('hide');
            getCourseGroups();
            $('#addCourseGroup')[0].reset();
        }
    });
};

function editCourseGroup() {
    $.ajax({
        type: "GET",
        url: $(this).data("url"),
        dataType: 'json',
        success: function(data) {
            var group = data.group;
            var cover = data.cover;
            $('#editCourseGroup').attr('action', `/courseGroups/${group._id}`);
            $('#id').val(group._id);
            $('#title').val(group.title);
            $('#cover').attr('src', cover);
            $('#editModal').modal('show');
        }
    });
};

function updateCourseGroup(event) {
    event.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        contentType: "application/json; charset=utf-8",
        type: 'PUT',
        data: JSON.stringify({
            id: $('#id').val(),
            title: $('#title').val(),
            cover: $('.filepond--data input').val()
        }),
        success: function(res) {
            $('#editModal').modal('hide');
            getCourseGroups();
            $('#editCourseGroup')[0].reset();
        }
    });
};

var del_url = '';

function removeCourseGroup() {
    del_url = $(this).data("url");
}

function deleteCourseGroup() {
    event.preventDefault();
    $.ajax({
        url: del_url,
        method: "DELETE",
        success: function(data) {
            $('#deleteModal').modal('hide');
            getCourseGroups();
        },
        error: function(jxqr, error, status) {
            console.log();
        }
    });
}