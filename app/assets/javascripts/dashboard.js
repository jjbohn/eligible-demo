window.Util = {
  saveSettings: function() {
    localStorage.setItem("eligibleDemoApiKey", $("#settings input[name='api_key']").val());
    localStorage.setItem("eligibleDemoFirstName", $("#settings input[name='first_name']").val());
    localStorage.setItem("eligibleDemoLastName", $("#settings input[name='last_name']").val());
    localStorage.setItem("eligibleDemoNpi", $("#settings input[name='npi']").val());
  },

  populateSettings: function() {
    $("#settings input[name='api_key']").val(localStorage.getItem("eligibleDemoApiKey"));
    $("#settings input[name='first_name']").val(localStorage.getItem("eligibleDemoFirstName"));
    $("#settings input[name='last_name']").val(localStorage.getItem("eligibleDemoLastName"));
    $("#settings input[name='npi']").val(localStorage.getItem("eligibleDemoNpi"));
  },

  bindServiceCodeSearch: function() {
    $(".service-code-search").focus(function() {
      $(this).parent().find("i.icon-search").css("opacity", "0");
    });

    $(".service-code-search").blur(function() {
      if ($(this).val().length == 0) {
        $(this).parent().find("i.icon-search").css("opacity", "1");
      };
    });
  },

  bindPatientSummaries: function() {
    $(".patient-summary").unbind();
    $(".patient-summary").click(function() {
      $(this).next().toggle();
    });
  }
};

$(document).ready(function() {
  $("#save-settings").click(function() {
    Util.saveSettings();
    $("#settings").modal("hide");
  });

  $("#settings.modal").on('hidden', function() {
    Util.populateSettings();
  });

  Util.bindPatientSummaries();
  Util.bindServiceCodeSearch();

  Util.populateSettings();

  $("#payers .label").hide();
  $("tr.patient-check").hide();

  $(".payer-accepted").click(function() {
    $(this).parent().find(".label-info").show();
    _this$ = $(this);
    $.post("/payers/" + $(this).data("payer-id"),
      {
        "_method": "PUT",
        accepted: $(this).parent().find("input:checked").length > 0
      },
      function(data) {
        _this$.parent().find(".label-info").hide();
        _this$.parent().find(".label-success").show();
        _this$.parent().find(".label-success").fadeOut(3000);
      }
    )
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
        $("button#add-patient").removeAttr("disabled");
        $("#add-patient").modal('hide');
        var addPatientRow = $("#patients table tbody tr:last").detach();
        console.log(data);
        $("#patients table tbody").append("<tr class='patient-summary'><td>" + data.first_name + "</td><td>" + data.last_name + "</td><td>" + data.dob + "</td><td>" + data.enrollments[0].member_id + "</td><td>" + data.enrollments[0].payer_name + "</td></tr>");
        $("#patients table tbody").append("<tr class='patient-check'><td colspan='5'><form class='form-inline'><label for='service_code'>Service code</label><i class='icon-search'></i><input class='service-code-search' name='service_code' type='text'><button class='btn btn-primary patient-check'>Check Eligibility</button></form></td></tr>");
        $("#patients table tbody").append(addPatientRow);
        $("tr.patient-check").hide();
        Util.bindPatientSummaries();
        Util.bindServiceCodeSearch();
        $("#add-patient input[name='member_id']").val(""),
        $("#add-patient input[name='first_name']").val(""),
        $("#add-patient input[name='last_name']").val(""),
        $("#add-patient input[name='dob']").val(""),
        $("#add-patient input[name='payer_id']").val("")
      }
    )
  });
});