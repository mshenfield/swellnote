import random
import sqlite3

def _connect():
    # TODO: Run analysis_limit and optimize on disconnect
    con = sqlite3.connect(
        "swell-note.db",
        # Use SQLite's underlying auto commit, avoiding the python lib's
        # convoluted transaction management
        isolation_level=None)
    cur = con.cursor()
    # Speed up writes 100x by sacrificing a bit of durability.  In the worst
    # case, a hard reboot or disk failure will cause the loss of recent
    # writes, but the database stays consistent.  Application restarts will
    # still save data correctly.
    cur.execute("pragma synchronous=NORMAL;")
    cur.execute("pragma journal_mode=wal;")
    cur.close()
    return con

def init_db():
    con = _connect()
    cur = con.cursor()
    cur.execute("""
CREATE TABLE IF NOT EXISTS message(
    id INTEGER PRIMARY KEY,
    content VARCHAR(1023),
    abusive BOOLEAN
);
    """)
    cur.close()
    con.close()


def get_random_message():
    """Efficiently grab a random message in O(logN) time.
    
    Described in https://stackoverflow.com/a/66085192/3925120. This part-Python version
    runs about half as fast the "all in SQL" approach, but is  still extremely fast.
    
    One downside is that this isn't perfectly random.  The first row after a
    cluster of abusive messages has a higher probability of being selected.
    """
    con = _connect()
    cur = con.cursor()
    max_id = int(cur.execute("SELECT max(id) FROM message WHERE abusive = false;").fetchone()[0])
    random_id = random.randint(1, max_id)
    random_content = cur.execute(
        "SELECT content FROM message WHERE id >= ? AND abusive = false LIMIT 1;",
        (random_id,),
    ).fetchone()[0]
    cur.close()
    con.close()
    return random_content


def create_message(content):
    """Create a new message with the provided content."""
    con = _connect()
    cur = con.cursor()
    cur.execute("INSERT INTO message VALUES(NULL, ?, false)", (content,))
    cur.close()
    con.close()