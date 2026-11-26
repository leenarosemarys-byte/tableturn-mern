'use strict';

/** A refusal the app gives. Services throw these; the error middleware turns them into problem+json. */
class DomainError extends Error {
  constructor(status, type, title, detail) {
    super(detail);
    this.status = status;
    this.type = type;
    this.title = title;
  }

  /** Extra fields for this refusal's answer (none by default). */
  extras() {
    return {};
  }
}

class ValidationError extends DomainError {
  /** @param errors [{ field, message }] */
  constructor(errors) {
    super(400, '/errors/validation', 'Invalid request', 'The request is not valid');
    this.errors = errors;
  }

  extras() {
    return { errors: this.errors };
  }
}

class NoSuchBranch extends DomainError {
  constructor(branch) {
    super(404, '/errors/no-such-branch', 'No such branch', `There is no branch ${branch}`);
  }
}

class NoSuchTable extends DomainError {
  constructor(branch, no) {
    super(404, '/errors/no-such-table', 'No such table', `Branch ${branch} has no table ${no}`);
  }
}

class PartyTooBig extends DomainError {
  constructor(covers, maxCovers) {
    super(400, '/errors/party-too-big', 'Party too big', `No table here seats ${covers}; the largest seats ${maxCovers}`);
    this.maxCovers = maxCovers;
  }

  extras() {
    return { maxCovers: this.maxCovers };
  }
}

class NoSuchParty extends DomainError {
  constructor(partyId) {
    super(404, '/errors/no-such-party', 'No such party', `Party ${partyId} is not on the list of this branch`);
  }
}

module.exports = {
  DomainError,
  ValidationError,
  NoSuchBranch,
  NoSuchTable,
  PartyTooBig,
  NoSuchParty,
};
