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

  settingsParams: function() {
    return {
      api_key: localStorage.getItem("eligibleDemoApiKey"),
      service_provider_first_name: localStorage.getItem("eligibleDemoFirstName"),
      service_provider_last_name: localStorage.getItem("eligibleDemoLastName"),
      service_provider_NPI: localStorage.getItem("eligibleDemoNpi")
    }
  },

  bindServiceCodeSearch: function() {
    $(".service-code-search").focus(function() {
      $(this).parent().find("i.icon-search").css("opacity", "0");
      $(this).css("background-color", "white");
    });

    $(".service-code-search").blur(function() {
      if ($(this).val().length == 0) {
        $(this).parent().find("i.icon-search").css("opacity", "1");
        $(this).css("background", "transparent");
      };
    });
  },

  bindPatientSummaries: function() {
    $(".patient-summary").unbind();
    $(".patient-summary").click(function() {
      $(this).next().toggle();
    });
  },

  bindEligibilityChecks: function() {
    $("button.patient-check").click(function() {
      _this$ = $(this);
      _this$.attr("disabled", "disabled");
      _this$.parent().parent().find(".checking-eligibility-spinner").css("opacity", "1");
      _this$.parent().parent().find(".checking-eligibility-spinner").spin({radius: 5, length: 3, width: 2});

      var patientSummary = $(this).parent().parent().parent().prev();
      var params = $.extend({}, Util.settingsParams(), {
        payer_id: patientSummary.data("payer-id"),
        service_type_code: $(this).parent().find("input[name='service_code']").val(),
        subscriber_id: patientSummary.data("member-id"),
        subscriber_last_name: patientSummary.data("last-name"),
        subscriber_first_name: patientSummary.data("first-name"),
        subscriber_dob: patientSummary.data("dob")
      });
      $.post("/eligibility_checks", params,
        function(data) {
          console.log(data);
          _this$.removeAttr("disabled");
          $(".checking-eligibility-spinner").css("opacity", 0);
          if (data.error) { 
            _this$.parent().parent().find(".coverage-status").html(data.error.reject_reason_description);
            _this$.parent().parent().find(".coverage-status").show();
            return; 
          };
          var statusCode = data.response.coverage_status;
          var status = statusCodes.filter(function(e, i, array) { return e.code == statusCode })[0].status;
          _this$.parent().parent().find(".coverage-status").html("Coverage status: " + status);
          _this$.parent().parent().find(".coverage-status").show();
          $("#logs tbody").append("<tr><td>" + data.response.timestamp + "</td><td>" + data.response.eligible_id + "</td><td>" + data.response.mapping_version.match(/([^\s]*)/)[0] + "</td><td colspan=2>Refresh page for data</td><td>" + data.response.type + "</td><td>" + status + "</td></tr>");
        }
      )
      return false;
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
  Util.bindEligibilityChecks();
  Util.populateSettings();

  $("#payers .label").hide();
  $("tr.patient-check").hide();
  $(".coverage-status").hide();

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

  $(".service-code-search").typeahead({
    source: eligibleServices,
    items: 4,
    updater: function(item) {
      var code = serviceCodes.filter(function(e, i, array) { return e["service"] == item } )[0]["code"]
      $(this.$element).parent().find(".service-code").val(code);
      return item;
    }
  });

  $("button#add-patient").click(function() {
    if (env == "production") {
      $("#add-patient .modal-body").html("To actually add your own data, see the instructions for <a href='http://github.com/eligibleAPI/eligible-demo'>cloning the repository</a>.")
      return;
    };
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
        $("#patients table tbody").append("<tr class='patient-summary'><td class='first_name'>" + data.first_name + "</td><td class='last_name'>" + data.last_name + "</td><td class='dob'>" + data.dob + "</td><td class='member_id'>" + data.enrollments[0].member_id + "</td><td class='payer_name'>" + data.enrollments[0].payer_name + "</td></tr>");
        $("#patients table tbody").append("<tr class='patient-check'><td colspan='5'><form class='form-inline'><label for='service_code'>Service code</label><i class='icon-search'></i><input class='service-code-search' name='service_code' type='text'><button class='btn btn-primary patient-check'>Check Eligibility</button></form></td></tr>");
        $("#patients table tbody").append(addPatientRow);
        $("tr.patient-check").hide();
        Util.bindPatientSummaries();
        Util.bindServiceCodeSearch();
        Util.bindEligibilityChecks();
        $("#add-patient input[name='member_id']").val(""),
        $("#add-patient input[name='first_name']").val(""),
        $("#add-patient input[name='last_name']").val(""),
        $("#add-patient input[name='dob']").val(""),
        $("#add-patient input[name='payer_id']").val("")
      }
    )
  });
});