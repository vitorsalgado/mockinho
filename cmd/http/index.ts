#!/usr/bin/env node

import { mockrushHTTP, opts } from '../../pkg/http'

mockrushHTTP(opts().port(3000).dynamicPort(false).loadFileStubs().verbose())
  .start()
  .then()
  .catch(console.error)
