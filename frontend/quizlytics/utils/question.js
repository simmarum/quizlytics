export function add_answer(answer_text) {
  console.log(answer_text)
  var q_answers = document.getElementById("q_answers");
  var all_answers = document.getElementsByClassName("q_answer");
  var new_id = 1;
  var i = 0;
  var j = all_answers.length
  for (; i < j; i++) {
    new_id = Math.max(parseInt(all_answers[i].getAttribute("id"), 10), new_id) + 1
  }

  var new_answer = document.createElement('div');
  new_answer.setAttribute("class", "row q_answer");
  new_answer.setAttribute("id", new_id);

  var tb = document.createElement('button');
  tb.setAttribute("class", "btn");
  tb.addEventListener('click', function () {
    tb.parentElement.remove();
  });
  tb.innerHTML = "Remove"

  var ti = document.createElement('input');
  ti.setAttribute("class", "col-8");
  ti.type = "text"
  if (answer_text != null) {
    ti.value = answer_text
  }

  new_answer.appendChild(tb)
  new_answer.appendChild(ti)
  q_answers.appendChild(new_answer)
}