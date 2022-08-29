const fullName = $('#name');
const sClass = $('#class');
const birthday = $('#birthday');
const age = $('#age');
const address = $('#address');
const email = $('#email');

function studentInfo(fullName, sClass, birthday, age, address, email) {
    this.name = fullName;
    this.class = sClass;
    this.birthday = birthday;
    this.age = age;
    this.address = address;
    this.email = email;
}

const app = (function () {
    let students = JSON.parse(localStorage.getItem('Student Information')) || [];
    let submit = $('#add');
    let remove = $('#remove');
    let saveChanges = $('#save');
    let closeEditModal = $('#close-edit-modal');
    let closeDeleteModal = $('#close-delete-modal');
    let indexOfDeleteElement;
    let indexOfEditElement;

    return {
        addToList(student) {
            students.push(student);
            localStorage.setItem('Student Information', JSON.stringify(students));
        },

        delete(index) {
            students.splice(index, 1);
            localStorage.setItem('Student Information', JSON.stringify(students));
        },

        getAge(id) {
            let birth = id.val();
            let yearOfBirth = new Date(birth);
            let yearNow = new Date();
            return yearNow.getFullYear() - yearOfBirth.getFullYear();
        },

        render() {
            let html = students.map((student, index) => {
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.name}</td>
                        <td>${student.class}</td>
                        <td>${student.birthday}</td>
                        <td>${student.age}</td>
                        <td>${student.address}</td>
                        <td>
                            <span>
                                <i id="edit" class="fa-solid fa-pen-to-square" onclick="app.showEditModal(this)"></i>
                                <i id="delete" class="fa-solid fa-trash-can" onclick="app.showDeleteModal(this)"></i>
                            </span>
                        </td>
                    </tr>
                `
            })

            $('tbody').html(html.join(''));
        },

        showEditModal(e) {
            $('#edit-modal').css({ "opacity":"1", "visibility":"visible" });
            indexOfEditElement = $(e).parents('tr').index();

            $('#name_edit').val(students[indexOfEditElement].name);
            $('#birthday_edit').val(students[indexOfEditElement].birthday);
            $('#address_edit').val(students[indexOfEditElement].address);
            $('#class_edit').val(students[indexOfEditElement].class);
            $('#email_edit').val(students[indexOfEditElement].email);

            return indexOfEditElement;
        },

        showDeleteModal(e) {
            $('#delete-modal').css({ "opacity":"1", "visibility":"visible" });
            indexOfDeleteElement = $(e).parents('tr').index();
            return indexOfDeleteElement;
        },

        handleDelete() {
            app.delete(indexOfDeleteElement);
            app.render();
            $('#delete-modal').css({ "opacity":"0", "visibility":"hidden" });
        },

        handleUpdate() {
            students[indexOfEditElement].name = $('#name_edit').val();
            students[indexOfEditElement].birthday = $('#birthday_edit').val()
            students[indexOfEditElement].age = app.getAge($('#birthday_edit'));
            students[indexOfEditElement].address = $('#address_edit').val()
            students[indexOfEditElement].class = $('#class_edit').val()
            students[indexOfEditElement].email = $('#email_edit').val()

            app.render();
            localStorage.setItem('Student Information', JSON.stringify(students));
            $('#edit-modal').css({ "opacity":"0", "visibility":"hidden" });
        },


        init() {
            birthday.change(() => { age.val(this.getAge(birthday)); })
            submit.click(() => {
                if (fullName.val() && sClass.val() && birthday.val() && age.val() && address.val() && email.val()) {

                    let student = new studentInfo(fullName.val(), sClass.val(), birthday.val(), age.val(), address.val(), email.val());
                    this.addToList(student);
                    this.render();

                    $('form').trigger('reset');
                    fullName.trigger('focus');
                }
            })

            closeEditModal.click(() => { $('#edit-modal').css({ "opacity":"0", "visibility":"hidden" }); })
            closeDeleteModal.click(() => { $('#delete-modal').css({ "opacity":"0", "visibility":"hidden" }); })
            remove.click(this.handleDelete);
            saveChanges.click(this.handleUpdate);

            this.render()
        }
    }
})();

app.init();
