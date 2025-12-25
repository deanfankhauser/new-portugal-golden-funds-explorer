-- Create a trigger function to sync fund_rankings.manual_rank to funds.final_rank
CREATE OR REPLACE FUNCTION sync_fund_ranking()
RETURNS TRIGGER AS $$
BEGIN
  -- Update funds.final_rank when fund_rankings.manual_rank changes
  UPDATE funds 
  SET final_rank = NEW.manual_rank,
      updated_at = now()
  WHERE id = NEW.fund_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on INSERT
CREATE TRIGGER sync_fund_ranking_on_insert
  AFTER INSERT ON fund_rankings
  FOR EACH ROW
  EXECUTE FUNCTION sync_fund_ranking();

-- Create trigger on UPDATE
CREATE TRIGGER sync_fund_ranking_on_update
  AFTER UPDATE OF manual_rank ON fund_rankings
  FOR EACH ROW
  WHEN (OLD.manual_rank IS DISTINCT FROM NEW.manual_rank)
  EXECUTE FUNCTION sync_fund_ranking();

-- Create trigger on DELETE to reset final_rank to 999
CREATE OR REPLACE FUNCTION reset_fund_ranking()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset funds.final_rank to 999 when ranking is deleted
  UPDATE funds 
  SET final_rank = 999,
      updated_at = now()
  WHERE id = OLD.fund_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER sync_fund_ranking_on_delete
  AFTER DELETE ON fund_rankings
  FOR EACH ROW
  EXECUTE FUNCTION reset_fund_ranking();

-- Backfill existing rankings: sync all current fund_rankings.manual_rank to funds.final_rank
UPDATE funds f
SET final_rank = fr.manual_rank,
    updated_at = now()
FROM fund_rankings fr
WHERE f.id = fr.fund_id;

-- Set default final_rank = 999 for funds without rankings
UPDATE funds
SET final_rank = 999
WHERE final_rank IS NULL;