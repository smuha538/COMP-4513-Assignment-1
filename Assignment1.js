const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://yuprihcjxllmezloeagx.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cHJpaGNqeGxsbWV6bG9lYWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4MzUwNjAsImV4cCI6MjAyMjQxMTA2MH0.C4Y9BobiJWXseMIw-UfWUD_HinPN2RqwuWN_uwKK0Yk';
const supabase = supa.createClient(supaUrl, supaAnonKey);

//Returns all the seasons
app.get('/api/seasons', async (req, res) => {
const {data, error} = await supabase
.from('seasons')
.select();
if (error)
{
    res.send(error);
    return;
}
res.send(data);
});

//Returns all the circuits
app.get('/api/circuits', async (req, res) => {
const {data, error} = await supabase
.from('circuits')
.select();
if (error)
{
    res.send(error);
    return;
}
res.send(data);
});

//Returns a specified circuit based on a reference
app.get('/api/circuits/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('circuits')
    .select()
    .eq('circuitRef', req.params.ref);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns the circuits used in a given season (ascending order of 'round')
app.get('/api/circuits/season/:year', async (req, res) => {
    const {data, error} = await supabase
    .from("circuits")
    .select('*, races!inner(year, round)')
    .eq('races.year', req.params.year)
    .order('round', {referencedTable: 'races', ascending: true });
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns all the constructors
app.get('/api/constructors', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select();
    if (error)
    {
        res.send(error);
        return;
    }
    res.send(data);
    });

//Returns a specified constructor based on a reference
app.get('/api/constructors/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select()
    .eq('constructorRef', req.params.ref);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns all the drivers
app.get('/api/drivers', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select();
    if (error)
    {
        res.send(error);
        return;
    }
    res.send(data);
    });

//Returns a specified driver based on a reference
app.get('/api/drivers/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select()
    .eq('driverRef', req.params.ref);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns a driver based on their surname using a substring
app.get('/api/drivers/search/:substring', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select()
    .ilike('surname', req.params.substring+'%');
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns all drivers in a specified race based on raceId
app.get('/api/drivers/race/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select('*, driverStandings!inner()')
    .eq('driverStandings.raceId', req.params.raceId);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns a specified race based on raceId
app.get('/api/races/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select(`
    raceId, year, round, circuits (name,location,country), name, date, time, url, fp1_date, fp1_time, fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time`)
    .eq('raceId',req.params.raceId);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns all the races in a specified season based on the year (ascending order of 'round')
app.get('/api/races/season/:year', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select()
    .eq('year',req.params.year)
    .order('round', { ascending: true });
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns the races in a specified season and round
app.get('/api/races/season/:year/:round', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select()
    .eq('year', req.params.year)
    .eq('round', req.params.round);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns all the races for a given circuit based on circuitRef (ascending order of 'year')
app.get('/api/races/circuits/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select('*, circuits!inner()')
    .eq('circuits.circuitRef', req.params.ref)
    .order('year', {ascending: true});
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns all the races for a given circuit between two years
app.get('/api/races/circuits/:ref/season/:start/:end', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select('*, circuits!inner()')
    .eq('circuits.circuitRef', req.params.ref)
    .gte('year', req.params.start).lte('year', req.params.end);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (req.params.start > req.params.end)
    {
        res.json({ message: 'Start Date is Later than the End Date. Please Reverse the Dates' });
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns the results for a specified race (ascending order of 'grid')
app.get('/api/results/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('results')
    .select(`
    resultId, number, grid, position, positionText, positionOrder, points, laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId, drivers (driverRef, code, forename, surname), races (name, round, year, date), constructors (name, constructorRef, nationality)
    `)
    .eq('raceId',req.params.raceId)
    .order('grid', { ascending: true });
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns all the results for a given driver
app.get('/api/results/driver/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('results')
    .select('*, drivers!inner()')
    .eq('drivers.driverRef',req.params.ref);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns all the results for a given driver between two years
app.get('/api/results/drivers/:ref/seasons/:start/:end', async (req, res) => {
    const {data, error} = await supabase
    .from('results')
    .select('*, drivers!inner(), races!inner()')
    .eq('drivers.driverRef',req.params.ref)
    .gte('races.year', req.params.start).lte('races.year', req.params.end);
    if (error)
    {
        res.send(error);
        return;
    }
    else if (req.params.start > req.params.end)
    {
        res.json({ message: 'Start Date is Later than the End Date. Please Reverse the Dates' });
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns the qualifying results for the specified race (ascending order of 'position')
app.get('/api/qualifying/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('qualifying')
    .select(`
    qualifyId, position, number, q1, q2, q3, drivers (driverRef, code, forename, surname), races (name, round, year, date), constructors (name, constructorRef, nationality)
    `).eq('raceId',req.params.raceId)
    .order('position', { ascending: true });
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns the current season driver standings table for the specified race (ascending order of 'position')
app.get('/api/standings/drivers/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('driverStandings')
    .select(`
    driverStandingsId, points, position, positionText, wins, races (name, round, year, date), drivers (driverRef, code, forename, surname)
    `).eq('raceId',req.params.raceId)
    .order('position', { ascending: true });
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

//Returns the current season constructors standings table for the specified race (ascending order of 'position')
app.get('/api/standings/constructors/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('constructorStandings')
    .select(`
    constructorStandingsId, points, position, positionText, wins, races (name, round, year, date), constructors (name, constructorRef, nationality)
    `).eq('raceId',req.params.raceId)
    .order('position', { ascending: true });
    if (error)
    {
        res.send(error);
        return;
    }
    else if (data.length == 0)
    {      
        res.json({ message: 'No Data Exists for the Request' });
        return;
    }
    res.send(data);
    });

app.listen(8080, () => {
console.log('http://localhost:8080/api/seasons');
console.log('http://localhost:8080/api/circuits');
console.log('http://localhost:8080/api/circuits/monaco');
console.log('http://localhost:8080/api/circuits/season/2020');
console.log('http://localhost:8080/api/constructors');
console.log('http://localhost:8080/api/constructors/mclaren');
console.log('http://localhost:8080/api/drivers');
console.log('http://localhost:8080/api/drivers/hamilton');
console.log('http://localhost:8080/api/drivers/search/sch');
console.log('http://localhost:8080/api/drivers/race/1106');
console.log('http://localhost:8080/api/races/1');
console.log('http://localhost:8080/api/races/season/2020');
console.log('http://localhost:8080/api/races/season/2022/4');
console.log('http://localhost:8080/api/races/circuits/monza');
console.log('http://localhost:8080/api/races/circuits/monza/season/2015/2020');
console.log('http://localhost:8080/api/races/circuits/monza/season/2020/2020');
console.log('http://localhost:8080/api/results/1106');
console.log('http://localhost:8080/api/results/driver/max_verstappen');
console.log('http://localhost:8080/api/results/drivers/sainz/seasons/2022/2022');
console.log('http://localhost:8080/api/qualifying/1106');
console.log('http://localhost:8080/api/standings/drivers/1106');
console.log('http://localhost:8080/api/standings/constructors/1106');
});