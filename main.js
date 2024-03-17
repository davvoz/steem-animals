
class SteemAccount {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.owner = data.owner;
      this.active = data.active;
      this.posting = data.posting;
      this.memo_key = data.memo_key;
      this.json_metadata = data.json_metadata;
      this.posting_json_metadata = data.posting_json_metadata;
      this.proxy = data.proxy;
      this.last_owner_update = new Date(data.last_owner_update);
      this.last_account_update = new Date(data.last_account_update);
      this.created = new Date(data.created);
      this.mined = data.mined;
      this.recovery_account = data.recovery_account;
      this.last_account_recovery = new Date(data.last_account_recovery);
      this.reset_account = data.reset_account;
      this.comment_count = data.comment_count;
      this.lifetime_vote_count = data.lifetime_vote_count;
      this.post_count = data.post_count;
      this.can_vote = data.can_vote;
      this.voting_manabar = data.voting_manabar;
      this.downvote_manabar = data.downvote_manabar;
      this.voting_power = data.voting_power;
      this.balance = data.balance;
      this.savings_balance = data.savings_balance;
      this.sbd_balance = data.sbd_balance;
      this.sbd_seconds = data.sbd_seconds;
      this.sbd_seconds_last_update = new Date(data.sbd_seconds_last_update);
      this.sbd_last_interest_payment = new Date(data.sbd_last_interest_payment);
      this.savings_sbd_balance = data.savings_sbd_balance;
      this.savings_sbd_seconds = data.savings_sbd_seconds;
      this.savings_sbd_seconds_last_update = new Date(data.savings_sbd_seconds_last_update);
      this.savings_sbd_last_interest_payment = new Date(data.savings_sbd_last_interest_payment);
      this.savings_withdraw_requests = data.savings_withdraw_requests;
      this.reward_sbd_balance = data.reward_sbd_balance;
      this.reward_steem_balance = data.reward_steem_balance;
      this.reward_vesting_balance = data.reward_vesting_balance;
      this.reward_vesting_steem = data.reward_vesting_steem;
      this.vesting_shares = data.vesting_shares;
      this.delegated_vesting_shares = data.delegated_vesting_shares;
      this.received_vesting_shares = data.received_vesting_shares;
      this.vesting_withdraw_rate = data.vesting_withdraw_rate;
      this.next_vesting_withdrawal = new Date(data.next_vesting_withdrawal);
      this.withdrawn = data.withdrawn;
      this.to_withdraw = data.to_withdraw;
      this.withdraw_routes = data.withdraw_routes;
      this.curation_rewards = data.curation_rewards;
      this.posting_rewards = data.posting_rewards;
      this.proxied_vsf_votes = data.proxied_vsf_votes;
      this.witnesses_voted_for = data.witnesses_voted_for;
      this.last_post = new Date(data.last_post);
      this.last_root_post = new Date(data.last_root_post);
      this.last_vote_time = new Date(data.last_vote_time);
      this.post_bandwidth = data.post_bandwidth;
      this.pending_claimed_accounts = data.pending_claimed_accounts;
      this.vesting_balance = data.vesting_balance;
      this.reputation = data.reputation;
      this.transfer_history = data.transfer_history;
      this.market_history = data.market_history;
      this.post_history = data.post_history;
      this.vote_history = data.vote_history;
      this.other_history = data.other_history;
      this.witness_votes = data.witness_votes;
      this.tags_usage = data.tags_usage;
      this.guest_bloggers = data.guest_bloggers;
    }
  }

// Sostituisci 'nome_utente' con il nome dell'account Steem di cui desideri ottenere le informazioni
const nome_utente = 'luciojolly';

// Endpoint per ottenere i dettagli dell'account
const url = 'https://api.steemit.com';

// Struttura della richiesta
const body = {
    method: 'POST',
    body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'condenser_api.get_accounts',
        params: [[nome_utente]],
        id: 1
    }),
    headers: {
        'Content-Type': 'application/json'
    }
};
let objProperties = [];
// Esegui la chiamata fetch
fetch(url, body)
    .then(response => response.json())
    .then(data => {
        console.log('Dati:', data);
        objProperties = Object.keys(data.result[0]);
        console.log('Proprietà:', objProperties);
        objProperties.forEach(element => {
            let nomeValore = element;
            console.log(element, data.result[0][element]);
        });

        // Display the data in the frontend
        const container = document.getElementById('dataContainer');
        // Create a table
        const table = document.createElement('table');
        const tableHead = document.createElement('thead');
        const tableBody = document.createElement('tbody');
        // Create the table headers
        const tableHeaders = ['Property', 'Value'];
        const headerRow = document.createElement('tr');
        tableHeaders.forEach(headerText => {
            const header = document.createElement('th');
            const textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        });
        tableHead.appendChild(headerRow);
        table.appendChild(tableHead);
        // Create the table rows
        objProperties.forEach(property => {
            const row = document.createElement('tr');
            const propertyCell = document.createElement('td');
            const valueCell = document.createElement('td');
            const propertyText = document.createTextNode(property);
            const valueText = document.createTextNode(data.result[0][property]);
            propertyCell.appendChild(propertyText);
            valueCell.appendChild(valueText);
            row.appendChild(propertyCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        });
        table.appendChild(tableBody);
        container.appendChild(table);

    })
    .catch(error => console.error('Errore:', error));
