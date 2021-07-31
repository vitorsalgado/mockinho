#!/usr/bin/env node

import { mockinhoHTTP, opts } from '../../pkg/http'

mockinhoHTTP(opts().port(3000).dynamicPort(false).loadFileStubs().verbose())
  .start()
  .then()
  .catch(console.error)
