INSERT INTO ev_master_comp_items (master_id, item_code, item_name, item_desc, applied_target_type)

WITH MatchedRules AS (
SELECT
m.master_id,
r.item_code,
r.target_type,
CASE r.target_type
WHEN 'TITLE' THEN 1 -- 1순위: 직급 (가장 우선)
WHEN 'DEPT' THEN 2 -- 2순위: 부서
WHEN 'ALL' THEN 3 -- 3순위: 전사 공통
ELSE 4
END AS priority_rank
FROM ev_master m
JOIN ev_user_info u
ON m.user_id = u.email
AND m.eval_year = u.applyYear
JOIN ev_item_mapping_rules r
ON r.apply_year = m.eval_year
WHERE m.eval_year = 2026 -- 적용할 평가 년도
AND (
(r.target_type = 'ALL')
OR (r.target_type = 'DEPT' AND r.target_value = u.departmentName)
OR (r.target_type = 'TITLE' AND r.target_value = u.titleName)
)
),
FilteredRules AS (
SELECT
master_id,
item_code,
target_type,
DENSE_RANK() OVER(PARTITION BY master_id ORDER BY priority_rank ASC) as user_rule_rank
FROM MatchedRules
)

SELECT
f.master_id,
c.item_code,
c.item_name,
c.item_desc,
f.target_type
FROM FilteredRules f
JOIN ev_capability_items c ON c.item_code = f.item_code
WHERE f.user_rule_rank = 1

ON DUPLICATE KEY UPDATE
item_name = VALUES(item_name),
item_desc = VALUES(item_desc),
applied_target_type = VALUES(applied_target_type);
# renewal_evaluation
