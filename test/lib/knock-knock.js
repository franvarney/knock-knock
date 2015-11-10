const Child = require('child_process');
const Code = require('code');
const Fs = require('fs');
const Lab = require('lab');
const Path = require('path');
const Sinon = require('sinon');

var lab = exports.lab = Lab.script();

var describe = lab.describe;
var after = lab.after;
var afterEach = lab.afterEach;
// var before = lab.before;
var beforeEach = lab.beforeEach;
var expect = Code.expect;
var it = lab.it;

const KnockKnock = require('../../lib/knock-knock');

var packagePath = Path.join(process.cwd(), 'package.json');
var out = Object.prototype;
var stdout;
var temp = process.env.NODE_ENV; // eslint-disable-line no-process-env

describe('lib/knock-knock', function () {
  beforeEach(function (done) {
    process.env.NODE_ENV = 'testenv'; // eslint-disable-line no-process-env

    out = {
      name: 'test',
      version: '0.1.0',
      env: process.env.NODE_ENV, // eslint-disable-line no-process-env
      node: '4.2.1',
      npm: '2.14.7'
    };
    out = JSON.stringify(out);

    stdout = '4.2.1\n2.14.7';

    Sinon.stub(Child, 'exec').yields(new Error('exec'));
    Sinon.stub(Fs, 'readFile').yields(new Error('readFile'));
    done();
  });

  afterEach(function (done) {
    Child.exec.restore();
    Fs.readFile.restore();

    done();
  });

  after(function (done) {
    process.env.NODE_ENV = temp; // eslint-disable-line no-process-env
    done();
  });

  describe('when called', function () {
    beforeEach(function (done) {
      Child.exec.yields(null, stdout);
      Fs.readFile.yields(null, out);
      done();
    });

    it('yields an object', function (done) {
      KnockKnock(function (err, results) {
        expect(err).to.be.null();
        expect(Fs.readFile.calledWith(packagePath)).to.be.true();
        expect(results).to.be.an.object();
        done();
      });
    });

    describe('the object', function () {
      it('has a key called name', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.name).to.equal('test');
          done();
        });
      });

      it('has a key called version', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.version).to.equal('0.1.0');
          done();
        });
      });

      it('has a key called env', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.env).to.equal('testenv');
          done();
        });
      });

      it('has a key called node', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.node).to.equal('4.2.1');
          done();
        });
      });

      it('has a key called npm', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.npm).to.equal('2.14.7');
          done();
        });
      });
    });
  });

  describe('when package.json is not found', function () {
    it('yields an error', function (done) {
      KnockKnock(function (err, results) {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('readFile');
        expect(results).to.be.undefined();
        done();
      });
    });
  });

  describe('when getting the node and npm version fails', function () {
    beforeEach(function (done) {
      Fs.readFile.yields(null, out);
      done();
    });

    it('yields an error', function (done) {
      KnockKnock(function (err, results) {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('exec');
        expect(results).to.be.undefined();
        done();
      });
    });
  });
});
