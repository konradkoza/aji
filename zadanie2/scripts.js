let todoList = [];

let initList = function () {
    let savedList = window.localStorage.getItem("todos");
    if (savedList != null) {
        todoList = JSON.parse(savedList);
    } else {
        todoList.push(
            {
                title: "Learn JS",
                description: "Create a demo application for my TODO's",
                place: "445",
                dueDate: new Date(2019, 10, 16)
            },
            {
                title: "Lecture test",
                description: "Quick test from the first three lectures",
                place: "F6",
                dueDate: new Date(2019, 10, 17)
            }
        );
    }
}

//initList();

const BASE_URL = "https://api.jsonbin.io/v3/b/651f1cba0574da7622b4e984";
const SECRET_KEY = "$2a$10$2InDCfc1/HvrK1asONakfO.KX90QO2Pwxx9nPm/PSdnWOqCO1ixfe";
$.ajax({
    url: BASE_URL,
    type: 'GET',
    headers: {
        'X-Master-Key': SECRET_KEY
    },
    success: (data) => {
        console.log(data.record);
        todoList = data.record;
    },
    error: (err) => {
        console.log(err.responseJSON);
    }
});


function dateFilteredList() {
    if ($("#startDate").val() === '' || $("#endDate").val() === '' || new Date($("#startDate").val()) > new Date($("#endDate").val())) {
        return todoList;
    }
    let startDate = new Date($("#startDate").val());
    let endDate = new Date($("#endDate").val());

    let newTodoList = todoList.filter((element) => {
        let dueDate = new Date(element.dueDate);
        return dueDate < endDate && dueDate > startDate;
    });

    return newTodoList;
}

let updateTodoList = function () {
    $("#table-body").empty();

    let filterInput = $("#inputSearch").val();
    let newTodoList = dateFilteredList();

    for (let todo in newTodoList) {
        // for (var todo = 0; todo < newTodoList.length; todo++) {
        if (
            (filterInput == "") ||
            (newTodoList[todo].title.includes(filterInput)) ||
            (newTodoList[todo].description.includes(filterInput))
        ) {
            $("#table-body").append(`
            <tr>
                <td>${newTodoList[todo].title}</td>
                <td>${newTodoList[todo].description}</td>
                <td>${newTodoList[todo].place}</td>
                <td>${new Date(newTodoList[todo].dueDate).toLocaleDateString()}</td>
                <td><button type="button" class="btn btn-danger" onclick="deleteTodo(${todo})">X</button></td>
            </tr>
        `);
        }
        // }
    }
}

setInterval(updateTodoList, 1000);

let deleteTodo = function (index) {
    todoList.splice(index, 1);
    updateJSONbin();
}

let addTodo = function () {

    let newTodo = {
        title: $("#inputTitle").val(),
        description: $("#inputDescription").val(),
        place: $("#inputPlace").val(),
        dueDate: new Date($("#inputDate").val())
    };

    todoList.push(newTodo);
    updateJSONbin();
}

let updateJSONbin = function () {
    $.ajax({
        url: BASE_URL,
        type: 'PUT',
        headers: {
            'X-Master-Key': SECRET_KEY
        },
        contentType: 'application/json',
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    })
};