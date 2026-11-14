# `src/services/` — serviços determinísticos

**Dono canônico:** AG-07.  
**Estado AG-09:** mocks tipados temporários (`matchingService`, `briefService`, `clusterService`) com a
mesma assinatura esperada. AG-07 substitui a implementação **sem** alterar exports consumidos pela UI.

Regras: sem React, sem Supabase, sem I/O; mesma entrada → mesma saída.
