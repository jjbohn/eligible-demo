window.Util = {
  saveSettings: function() {

  },

  populateSettings: function() {

  }
};

$(document).ready(function() {
  $("#save-settings").click(function() {
    Util.saveSettings();
  });

  $(".payer-typeahead").typeahead({
    source: payerIds,
    items: 6,
    updater: function(item) {
      $("input[name='payer_id']").val(item.match(/\((.*)\)$/)[1]);
      $("input[name='payer']").val(item);
      return item;
    }
  });

  $("button#add-patient").click(function() {
    $(this).attr("disabled", "disabled");
    $.post("/patients",
      {
        member_id: $("#add-patient input[name='member_id']").val(),
        first_name: $("#add-patient input[name='first_name']").val(),
        last_name: $("#add-patient input[name='last_name']").val(),
        dob: $("#add-patient input[name='dob']").val(),
        payer_id: $("#add-patient input[name='payer_id']").val(),
        payer_name: $("#add-patient input[name='payer']").val()
      }, 
      function(data) {
        console.log(data);
        $("button#add-patient").removeAttr("disabled");
        $("#add-patient").modal('hide');
        $("#patients table tbody").append("<tr><td>" + data.first_name + "</td><td>" + data.last_name + "</td><td>" + data.dob + "</td><td>" + data.enrollments[0].member_id + "</tr>");
        $("#add-patient input[name='member_id']").val(""),
        $("#add-patient input[name='first_name']").val(""),
        $("#add-patient input[name='last_name']").val(""),
        $("#add-patient input[name='dob']").val(""),
        $("#add-patient input[name='payer_id']").val("")
      }
    )
  });
});