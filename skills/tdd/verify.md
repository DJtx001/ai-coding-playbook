---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 559870e510009cc493bccfa4a6acb43e_20f4e332d08311f1acb8525400638852
    ReservedCode1: PxUK+4ZQ4RFuvMxtPpTYhfyuSrSdJW2p4pT0LpecWsqYgpcEm39FyjaL6CJ+ONg3Y9pqB+HWzVijO3//369yjKD4qXF+NYmEtpi8E7WBPNLdS5W+AZQjGxq2lqL2SPrMqeFFF16uvkMDUCYZ8dwu5iudLMKxIAcsWqyqocMyv+Du5+zRcPcineifVl0=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 559870e510009cc493bccfa4a6acb43e_20f4e332d08311f1acb8525400638852
    ReservedCode2: PxUK+4ZQ4RFuvMxtPpTYhfyuSrSdJW2p4pT0LpecWsqYgpcEm39FyjaL6CJ+ONg3Y9pqB+HWzVijO3//369yjKD4qXF+NYmEtpi8E7WBPNLdS5W+AZQjGxq2lqL2SPrMqeFFF16uvkMDUCYZ8dwu5iudLMKxIAcsWqyqocMyv+Du5+zRcPcineifVl0=
---

# Verifying the loop

Red before green is not enough: a test you never watched fail proves nothing.

**RED is valid only if you ran it.** Before writing implementation, run the test and confirm three things: it fails rather than errors, the failure message is the one you expected, and it fails because the behavior is missing, not because of a typo or import error. A test that passes immediately is testing existing behavior, so rewrite it. It does not count as RED.

**GREEN means the suite, not your file.** Once the test passes, run the project's own test command (`npm test`, `pytest`, `cargo test`), not only the file you touched. A green run of one file is not a green suite. Every failure that run shows goes in your report by name; a red test you watched scroll past and did not mention is a report falsified by omission.
*（内容由AI生成，仅供参考）*
