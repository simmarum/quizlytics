export function add_answer(answer_text) {
  console.log(answer_text)
  var q_answers = document.getElementById("q_answers");
  var all_answers = document.getElementsByClassName("q_answer");
  var new_id = 1;
  var i = 0;
  var j = all_answers.length
  for (; i < j; i++) {
    new_id = Math.max(parseInt(all_answers[i].getAttribute("id_int"), 10), new_id) + 1
  }

  var new_answer = document.createElement('div');
  new_answer.setAttribute("class", "row q_answer");
  new_answer.setAttribute("id_int", new_id);
  let div_id = "a_" + new_id
  new_answer.setAttribute("id", div_id);

  var tb = document.createElement('button');
  tb.setAttribute("class", "btn");
  tb.setAttribute("data-div_id", div_id)
  tb.addEventListener('click', function () {
    var div_id_to_rm = this.getAttribute("data-div_id")
    var div_to_rm = document.getElementById(div_id_to_rm)
    div_to_rm.parentNode.removeChild(div_to_rm);
  });
  tb.innerHTML = "Remove"

  var ti = document.createElement('input');
  ti.setAttribute("class", "col-8");
  ti.type = "text"
  ti.id = `aa_${new_id}`
  if (answer_text != null) {
    ti.value = answer_text
  }

  new_answer.appendChild(tb)
  new_answer.appendChild(ti)
  q_answers.appendChild(new_answer)
}