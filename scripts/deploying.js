$(document).ready(() => {

  function update_status(newMessage, excludeCount) {
    let message = '';

    if (excludeCount) {
      message = `${newMessage}\n${message}`;
    } else {
      newMessage = newMessage.replace(/^\s+|\s+$/g, '');
      message = `${newMessage}\n${message}`;
    }

    $('textarea#status').val(message);
  }

  function poll(guid) {

    var complete = false;
    var data = {};
    data.guid = guid;

    $.ajax({
      url: '/api/status',
      type: 'POST',
      data: data,
      success: function (response) {

        var message = response.message;
        var scratch_url = response.scratch_url;
        var stage = response.stage;
        var error_message = response.error_message;

        complete = response.complete;

        if (stage === 'error') {
          message = `Sorry, something went wrong. Please log an issue on github: https://github.com/wadewegner/deploy-to-sfdx/issues.\n\nError: ${error_message}\n`;
        }

        update_status(message);

        if (complete && stage === 'error') {
          $('div#loaderBlock').hide();
        }

        if (complete && stage !== 'error') {
          $('#loginUrl').attr('href', scratch_url);
          $('#loginUrl').text(`${scratch_url.substring(0, 80)}...`);
          $('#loginBlock').show();
          $('div#loaderBlock').hide();
        }
      },
      dataType: 'json',
      complete: setTimeout(function () {
        if (!complete) {
          poll(guid);
        }
      }, 2500),
      timeout: 2000
    });
  }

  function createJob(settings) {

    $.ajax({
      type: 'POST',
      url: '/api/deploy',
      data: JSON.stringify(settings),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: false,
      success: () => {
        // update_status(`Started job: ${settings.guid}`);
      },
      error: (commandDataResponse) => {
        update_status(`Sorry, something went wrong. Please log an issue on github: https://github.com/wadewegner/deploy-to-sfdx/issues.\n\nError: ${commandDataResponse.responseText}\n`, true);
        $('div#loaderBlock').hide();
      }
    });
  }

  const githubRepo = $('input#template').val();
  const guid = $('input#guid').val();

  let yamlFile = githubRepo.replace('github.com', 'raw.githubusercontent.com');
  yamlFile += '/master/.salesforcedx.yaml';

  const settings = {};
  settings.githubRepo = githubRepo;
  settings.guid = guid;

  $.ajax({
    url: yamlFile,
    type: 'GET',
    async: false,
    error: (XMLHttpRequest, textStatus, errorThrown) => {

      settings.assignPermset = 'false';
      settings.permsetName = '';
      settings.deleteScratchOrg = 'false';
      settings.runApexTests = 'false';
      settings.scratchOrgDef = 'config/project-scratch-def.json';
      settings.showScratchOrgUrl = 'true';

    },
    success: (yamlFileDataResponse, status) => {

      const doc = jsyaml.load(yamlFileDataResponse);

      settings.assignPermset = doc['assign-permset'];
      settings.permsetName = doc['permset-name'];
      settings.deleteScratchOrg = doc['delete-scratch-org'];
      settings.runApexTests = doc['run-apex-tests'];
      settings.scratchOrgDef = doc['scratch-org-def'];
      settings.showScratchOrgUrl = doc['show-scratch-org-url'];

    }
  });

  createJob(settings);

  poll(guid);

});